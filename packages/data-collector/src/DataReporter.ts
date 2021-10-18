import { StrippedNetworkCall } from '../../types/src/network-call'

import { Scheduler } from './Scheduler'
import Store from './store'

export class DataReporter {
  private currentRequests: StrippedNetworkCall[] = []
  private store: typeof Store
  private scheduler = new Scheduler(5000)

  constructor(store: typeof Store) {
    this.store = store
    this.scheduler.setCallback(this.sendRequests)
  }

  sendRequests = async () => {
    await this.getRequests()
    const requests = [...this.currentRequests]
    if (!requests?.length) return
    try {
      await this.store.api.createNetworkCalls(requests)
      this.currentRequests = []
    } catch (e) {
      this.currentRequests = requests
    }
  }

  private getRequests = async () => {
    const requestsFromStorage =
      await this.store.storageHandler.getNetworkCallsToSync()
    this.currentRequests = [...this.currentRequests, ...requestsFromStorage]
  }
}
