import { MESSAGE_TYPES } from '@data-collector/types'

import { headerListener } from './headerListener'
import store from './store'

try {
  chrome.webRequest.onResponseStarted.addListener(
    headerListener,
    { urls: ['<all_urls>'] },
    ['responseHeaders']
  )

  chrome.runtime.onMessageExternal.addListener(
    (details: any, sender, sendResponse) => {
      if (!details) return
      const type = details.type

      switch (type) {
        case MESSAGE_TYPES.REQUEST_CONFIRMATION:
          sendResponse({ exists: true })
          break
        case MESSAGE_TYPES.REQUEST_CREDENTIALS:
          store.auth.getToken().then(sendResponse)
          break
        default:
          break
      }
    }
  )

  chrome.runtime.onMessage.addListener((details: any) => {
    if (!details) return
    const type = details.type

    switch (type) {
      case MESSAGE_TYPES.NETWORK_CALL:
        const { networkCall } = details
        store.duplicateHandler.handleNetworkCall(networkCall)
        return
      case MESSAGE_TYPES.SIGN_IN:
        store.auth.signIn()
        return
      case MESSAGE_TYPES.REQUEST_USER:
        store.sendUser()
        return
      case MESSAGE_TYPES.REQUEST_USAGE:
        store.usageCounter.sendUsageUpdate()
        return
      case MESSAGE_TYPES.REQUEST_CREDENTIALS:
        store.auth.sendCredentials()
        return
      default:
        console.log(type)
    }
  })
} catch (e) {
  console.error(e)
}
