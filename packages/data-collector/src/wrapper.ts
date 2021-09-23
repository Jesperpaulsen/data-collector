import { MESSAGE_TYPES } from '@data-collector/types'

import { headerListener } from './headerListener'
import store from './store'

try {
  chrome.alarms.create({
    periodInMinutes: store.dataReporter.interval,
    when: 0
  })
  chrome.alarms.onAlarm.addListener(function () {
    console.log('Alarm')
    store.dataReporter.sendRequests()
  })

  chrome.webRequest.onHeadersReceived.addListener(
    headerListener,
    { urls: ['<all_urls>'] },
    ['responseHeaders']
  )
  chrome.runtime.onMessage.addListener(function (details: any) {
    const type = details.type
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
      case MESSAGE_TYPES.SYNC_REQUESTS:
        store.dataReporter.sendRequests()
        return
      default:
        console.log(type)
    }
  })
} catch (e) {
  console.error(e)
}
