import { MESSAGE_TYPES } from '@data-collector/types'

import { headerListener } from './headerListener'
import store from './store'

chrome.alarms.create({ periodInMinutes: store.dataReporter.interval })
chrome.alarms.onAlarm.addListener(function () {
  store.dataReporter.sendRequests()
})

try {
  chrome.webRequest.onHeadersReceived.addListener(
    headerListener,
    { urls: ['<all_urls>'] },
    ['responseHeaders']
  )
  chrome.runtime.onMessage.addListener(function (details: any) {
    if (details.type === MESSAGE_TYPES.NETWORK_CALL) {
      const { networkCall } = details
      store.duplicateHandler.handleNetworkCall(networkCall)
    } else if (details.type === MESSAGE_TYPES.SIGN_IN) {
      store.auth.signIn()
    } else if (details.type === MESSAGE_TYPES.REQUEST_USER) {
      console.log('request user')
      store.sendUser()
    }
  })
} catch (e) {
  console.error(e)
}
