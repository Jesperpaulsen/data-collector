import { MESSAGE_TYPES, NetworkCall } from '@data-collector/types'

import { getContentTypeHeader } from './utils'

const OriginalXHR = window.XMLHttpRequest

function mockXHR() {
  console.log('yo')
  const xhr = new OriginalXHR()
  xhr.addEventListener('readystatechange', function () {
    if (xhr.readyState === 4) {
      const url = new URL(xhr.responseURL)
      const networkCall: NetworkCall = {
        headers: xhr.getAllResponseHeaders(),
        type: getContentTypeHeader(xhr.getResponseHeader('content-type')),
        targetOrigin: url.origin,
        targetPathname: url.pathname,
        data: xhr.response,
        timestamp: Math.floor(Date.now().valueOf() / 100),
        hostPathname: window.location.pathname,
        hostOrigin: window.location.origin
      }
      window.postMessage({ type: MESSAGE_TYPES.NETWORK_CALL, networkCall }, '*')
    }
  })
  return xhr
}
// @ts-ignore
window.XMLHttpRequest = mockXHR
