import { MESSAGE_TYPES } from '@data-collector/types'

import {
  headerListener,
  onBeforeRequestListener,
  onSendHeaderListener
} from './headerListener'
import store from './store'

try {
  chrome.webRequest.onResponseStarted.addListener(
    headerListener,
    { urls: ['<all_urls>'] },
    ['responseHeaders']
  )

  chrome.webRequest.onBeforeRequest.addListener(
    onBeforeRequestListener,
    { urls: ['<all_urls>'] },
    ['requestBody']
  )

  chrome.webRequest.onSendHeaders.addListener(
    onSendHeaderListener,
    { urls: ['<all_urls>'] },
    ['requestHeaders']
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
        case MESSAGE_TYPES.REQUEST_HOST_ALIAS_ARRAY:
          store.hostAnonymizer.getAllAliases().then(sendResponse)
          break
        default:
          break
      }
    }
  )

  chrome.runtime.onMessage.addListener((details: any) => {
    if (!details) return
    const { payload, type } = details

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
      case MESSAGE_TYPES.REQUEST_RESET_COUNTER:
        store.usageCounter.listenToChanges()
        return
      case MESSAGE_TYPES.REQUEST_BLACKLISTED_PAGES:
        store.blackLister.sendBlackListedPages()
        return
      case MESSAGE_TYPES.ADD_BLACKLISTED_PAGE:
        store.blackLister.addBlackListedPage(payload)
        return
      case MESSAGE_TYPES.DELETE_BLACKLISTED_PAGE:
        store.blackLister.removeBlackListedPage(payload)
        return
      case MESSAGE_TYPES.REQUEST_REPORTS:
        store.habitsReporter.sendReports()
        return
      case MESSAGE_TYPES.REQUEST_TIPS:
        store.tipsHandler.sendTips()
        return
      case MESSAGE_TYPES.REQUEST_EXTENDED_POLLUTION:
        store.extendedPollution.sendExtendedPollution()
        return
      case MESSAGE_TYPES.SET_EXTENDED_POLLUTION:
        const { extendedPollution } = payload
        store.extendedPollution.setExtendedPollution(extendedPollution)
        return
      default:
        console.log(type)
    }
  })
} catch (e) {
  console.error(e)
}
