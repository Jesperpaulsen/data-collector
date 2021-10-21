import { MESSAGE_TYPES, NetworkCall } from '@data-collector/types'

import { getNetworkCallTimestamp } from './date'
import { getContentTypeHeader } from './utils'
;(function () {
  const origOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener('load', function () {
      const url = new URL(this.responseURL)
      const networkCall: NetworkCall = {
        headers: this.getAllResponseHeaders(),
        type: getContentTypeHeader(this.getResponseHeader('content-type')),
        targetOrigin: url.origin,
        targetPathname: url.pathname,
        data: this.response,
        timestamp: getNetworkCallTimestamp(),
        hostPathname: window.location.pathname,
        hostOrigin: window.location.origin
      }
      window.postMessage({ type: MESSAGE_TYPES.NETWORK_CALL, networkCall }, '*')
    })
    // @ts-ignore
    origOpen.apply(this, arguments)
  }
})()
