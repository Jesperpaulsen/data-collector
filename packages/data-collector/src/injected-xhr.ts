import { NetworkCall } from '@data-collector/types'

import { getContentTypeHeader } from './utils'

const OriginalXHR = window.XMLHttpRequest

function mockXHR() {
  const xhr = new OriginalXHR()
  xhr.addEventListener(
    'readystatechange',
    function async() {
      if (xhr.readyState === 4) {
        const networkCall: NetworkCall = {
          headers: xhr.getAllResponseHeaders(),
          type: getContentTypeHeader(xhr.getResponseHeader('content-type')),
          url: xhr.responseURL,
          data: xhr.response,
          timestamp: Math.floor(Date.now().valueOf() / 100),
          host: {
            pathname: window.location.pathname,
            origin: window.location.origin
          }
        }
        window.postMessage({ type: 'networkCall', networkCall }, '*')
      }
    },
    false
  )
  return xhr
}
// @ts-ignore
window.XMLHttpRequest = mockXHR
