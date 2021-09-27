import { NetworkCall } from '@data-collector/types'

import store from './store'

const getUrlForTab = async (
  tabId: number
): Promise<{ origin: string; pathname: string }> => {
  const host = {
    pathname: '',
    origin: ''
  }
  if (!tabId || tabId < 0) return host
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

export const headerListener = (
  details: chrome.webRequest.WebResponseCacheDetails
) => {
  let fileSize: number
  let headers = ''
  const timestamp = Math.floor(Date.now().valueOf() / 100)
  details.responseHeaders?.forEach((header) => {
    headers += `${header.name}: ${header.value}`
    if (header.name.toLowerCase() === 'content-length')
      fileSize = Number(header.value)
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
      hostPathname: host.pathname,
      targetIP: details.ip,
      fromCache: details.fromCache
    }
    store.duplicateHandler.handleNetworkCall(networkCall)
  })
}
