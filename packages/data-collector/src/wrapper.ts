/* eslint-disable no-global-assign */
import { NetworkCall } from '../../types/src/network-call'

import auth from './auth'
import { DataReporter } from './DataReporter'

const dataReporter = new DataReporter('')
chrome.alarms.create({ delayInMinutes: dataReporter.interval })
chrome.alarms.onAlarm.addListener(() => {
  dataReporter.sendRequests()
})

const urlHashMapWithSize: { [hash: string]: NetworkCall } = {}

const networkCallsMissingSize: { [url: string]: NetworkCall } = {}

const allRequests: { [url: string]: NetworkCall } = {}

export const generateHash = (stringToHash: string) => {
  let hash = 0
  if (stringToHash.length === 0) return hash
  for (let i = 0; i < stringToHash.length; i++) {
    const chr = stringToHash.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash
}

export const createNetworkCallAndTimestampString = (
  url: string,
  timestamp: number
) => `${url}${timestamp}`

export const createNetworkCallHash = (url: string, timestamp: number) => {
  const urlAndTimestampString = createNetworkCallAndTimestampString(
    url,
    timestamp
  )
  const hash = generateHash(urlAndTimestampString)
  return hash
}

const checkIfPotentialConflict = (
  existingNetworkCall: NetworkCall,
  networkCall: NetworkCall
) => {
  return (
    (existingNetworkCall.manuallyCalculated &&
      !networkCall.manuallyCalculated) ||
    (networkCall.manuallyCalculated && !existingNetworkCall.manuallyCalculated)
  )
}

export const storeNetworkCall = (networkCall: NetworkCall) => {
  const url = `${networkCall.targetOrigin}/${networkCall.targetPathname}`
  const networkCallHash = createNetworkCallHash(url, networkCall.timestamp)
  const existingNetworkCall = urlHashMapWithSize[networkCallHash]

  if (!networkCall.size && !existingNetworkCall)
    networkCallsMissingSize[url] = networkCall

  if (existingNetworkCall) {
    if (!existingNetworkCall.size || !networkCall.size) return
    if (checkIfPotentialConflict(existingNetworkCall, networkCall)) {
      if (existingNetworkCall.size > networkCall!.size) {
        allRequests[url] = existingNetworkCall
      } else {
        allRequests[url] = networkCall
        urlHashMapWithSize[networkCallHash] = networkCall
      }
    }
  } else if (networkCall.size) {
    allRequests[url] = networkCall
    urlHashMapWithSize[url] = networkCall
  }
}

const getUrlForTab = async (
  tabId: number
): Promise<{ origin: string; pathname: string }> => {
  const host = {
    pathname: '',
    origin: ''
  }
  if (!tabId) return host
  return new Promise((resolve) => {
    chrome.tabs.get(tabId, (tab) => {
      if (!tab?.url) return resolve(host)

      const url = new URL(tab.url)
      host.pathname = url.pathname
      host.origin = url.origin
      resolve(host)
    })
  })
}

// TODO: Look into why manifest v3 doesn't work with module imports
export const headerListener = (
  details: chrome.webRequest.WebResponseHeadersDetails
) => {
  let fileSize
  let headers = ''
  const timestamp = Math.floor(Date.now().valueOf() / 100)
  details.responseHeaders?.forEach((header) => {
    headers += `${header.name}: ${header.value}`
    if (header.name.toLowerCase() === 'content-length') fileSize = header.value
  })

  const url = new URL(details.url)

  getUrlForTab(details.tabId).then((host) => {
    const networkCall: NetworkCall = {
      headers,
      timestamp,
      type: 'text', // TODO: Check if we need this
      targetOrigin: url.origin,
      targetPathname: url.pathname,
      size: fileSize,
      manuallyCalculated: false,
      hostOrigin: host.origin,
      hostPathname: host.pathname
    }
    storeNetworkCall(networkCall)
  })
}

try {
  chrome.webRequest.onHeadersReceived.addListener(
    headerListener,
    { urls: ['<all_urls>'] },
    ['responseHeaders']
  )
  chrome.runtime.onMessage.addListener(function (details: any) {
    console.log(details)
    if (details.type === 'networkCall') {
      const { networkCall } = details
      storeNetworkCall(networkCall as NetworkCall)
    } else if (details.type === 'signIn') {
      auth.signIn()
    }
  })
} catch (e) {
  console.error(e)
}
