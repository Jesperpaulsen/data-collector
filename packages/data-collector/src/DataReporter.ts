/**
 * TODO:
 * * Update database with network calls every 5 sec
 * * Determine data structure
 */

import { NetworkCall } from '../../types/src/network-call'

import Store from './store'

export class DataReporter {
  private currentRequests: NetworkCall[] = []
  interval = 1
  private store: typeof Store

  constructor(store: typeof Store) {
    this.store = store
  }

  sendRequests = async () => {
    await this.getRequests()
    const requests = [...this.currentRequests]
    console.log('Reporting', requests)
    try {
      await this.store.api.createNetworkCalls(requests)
      this.currentRequests = []
    } catch (e) {
      this.currentRequests = requests
    }
  }

  getRequests = async () => {
    const requestsFromStorage =
      await this.store.storageHandler.getNetworkCallsToSync()
    this.currentRequests = [...this.currentRequests, ...requestsFromStorage]
  }
}
