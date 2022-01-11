import { NetworkCall, StrippedNetworkCall } from '../../types/src/network-call'

import { Scheduler } from './Scheduler'
import Store from './store'

export class DataReporter {
  private currentRequests: { [hash: number]: NetworkCall } = {}
  private store: typeof Store
  private scheduler = new Scheduler(10000)

  constructor(store: typeof Store) {
    this.store = store
    this.scheduler.setCallback(this.sendRequests)
  }

  private filterNetworkCalls = () => {
    const res: StrippedNetworkCall[] = []
    for (const networkCall of Object.values(this.currentRequests)) {
      if (
        networkCall.fromCache ||
        this.store.blackLister.checkIfUrlIsBlackListed(networkCall.hostOrigin)
      )
        continue
      const usageDoc: StrippedNetworkCall = {
        hostOrigin: this.store.hostAnonymizer.convertHostToAlias(
          networkCall.hostOrigin
        ),
        size: (networkCall.size || 0) + (networkCall.outgoingSize || 0),
        targetIP: networkCall.targetIP,
        userId: networkCall.userId
      }
      res.push(usageDoc)
    }
    return res
  }

  private storeNetworkCallAsRequestFailed = () => {
    for (const [hash, networkCall] of Object.entries(this.currentRequests)) {
      this.store.storageHandler.storeNetworkCall(Number(hash), networkCall)
    }
  }

  sendRequests = async () => {
    if (!this.store.user) return
    await this.getRequests()
    const requests = this.filterNetworkCalls()
    if (!requests?.length) return
    try {
      await this.store.api.createNetworkCalls(requests)
      this.currentRequests = []
    } catch (e) {
      this.scheduler.delayNextCallback(30000)
      this.storeNetworkCallAsRequestFailed()
    }
  }

  private getRequests = async () => {
    const requestsFromStorage =
      await this.store.storageHandler.getNetworkCallsToSync()
    this.currentRequests = requestsFromStorage
  }
}
