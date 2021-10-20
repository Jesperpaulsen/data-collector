import { NetworkCall } from '@data-collector/types'

import { getNetworkCallTimestamp } from './date'
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

const getSizeFromHeaders = (headers?: chrome.webRequest.HttpHeader[]) => {
  let bodySize = 0
  let tmpHeaderString = ''
  if (!headers) return 0

  for (const header of headers) {
    tmpHeaderString += `${header.name}${header.value || header.binaryValue}`
    if (header.name.toLowerCase() === 'content-length') {
      bodySize = Number(header.value || header.binaryValue || 0)
    }
  }
  const headerSize = new Blob([tmpHeaderString]).size
  return bodySize + headerSize
}

export const headerListener = (
  details: chrome.webRequest.WebResponseCacheDetails
) => {
  const timestamp = getNetworkCallTimestamp()
  const size = getSizeFromHeaders(details.responseHeaders)

  const url = new URL(details.url)

  getUrlForTab(details.tabId).then((host) => {
    const networkCall: NetworkCall = {
      timestamp,
      type: 'text', // TODO: Check if we need this
      targetOrigin: url.origin,
      targetPathname: url.pathname,
      size,
      manuallyCalculated: false,
      hostOrigin: host.origin,
      hostPathname: host.pathname,
      targetIP: details.ip,
      fromCache: details.fromCache,
      requestId: details.requestId
    }
    store.duplicateHandler.handleNetworkCall(networkCall)
  })
}

const getSizeFromRawRequestBody = (
  rawData?: chrome.webRequest.UploadData[]
) => {
  let size = 0
  if (!rawData) return size
  for (const data of rawData) {
    size += data.bytes?.byteLength || 0
  }
  return size
}

export const onBeforeRequestListener = (
  details: chrome.webRequest.WebRequestBodyDetails
) => {
  const timestamp = getNetworkCallTimestamp()
  const size = getSizeFromRawRequestBody(details.requestBody?.raw)
  const url = new URL(details.url)

  getUrlForTab(details.tabId).then((host) => {
    const networkCall: NetworkCall = {
      timestamp,
      type: 'text',
      targetOrigin: url.origin,
      targetPathname: url.pathname,
      size,
      manuallyCalculated: false,
      hostOrigin: host.origin,
      hostPathname: host.pathname,
      requestId: details.requestId
    }
    store.sentRequestsHandler.addRequest(networkCall)
  })
}

export const onSendHeaderListener = (
  details: chrome.webRequest.WebRequestHeadersDetails
) => {
  const size = getSizeFromHeaders(details.requestHeaders)
  store.sentRequestsHandler.updateSizeToRequest(details.requestId, size)
}
