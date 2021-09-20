import { NetworkCall } from '@data-collector/types'

import { getContentTypeHeader } from './utils'

const OriginalXHR = window.XMLHttpRequest

function mockXHR() {
  const xhr = new OriginalXHR()
  xhr.addEventListener('readystatechange', function async() {
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
      window.postMessage({ type: 'networkCall', networkCall }, '*')
    }
  })
  return xhr
}
// @ts-ignore
window.XMLHttpRequest = mockXHR
