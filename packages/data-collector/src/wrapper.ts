import { MESSAGE_TYPES } from '@data-collector/types'

import { headerListener } from './headerListener'
import store from './store'

try {
  chrome.webRequest.onResponseStarted.addListener(
    headerListener,
    { urls: ['<all_urls>'] },
    ['responseHeaders']
  )

  chrome.runtime.onMessage.addListener((details: any) => {
    const type = details.type
    console.log(type)
    switch (type) {
      case MESSAGE_TYPES.NETWORK_CALL:
        // eslint-disable-next-line no-case-declarations
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
