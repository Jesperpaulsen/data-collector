import { NetworkCall } from '@data-collector/types'

import Store from './store'

type NetworkCalls = { [hash: number]: NetworkCall }

const storageKey = 'dataStorage'

export class StorageHandler {
  private store: typeof Store
  private networkCalls: NetworkCalls = {}
  private interval = 1000
  private timeout?: ReturnType<typeof setTimeout>
  private nextSync = Date.now()
  private syncInProgress = false

  constructor(store: typeof Store) {
    this.store = store
  }

  private setNextSync = (interval: number) => {
    this.nextSync = Date.now() + interval
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(this.handleSync, interval)
  }

  private sleep = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 100)
    })
  }

  private handleSync = async () => {
    if (this.syncInProgress) {
      await this.sleep()
      this.handleSync()
      return
    }
    const now = Date.now()
    if (now < this.nextSync) {
      this.setNextSync(this.nextSync - now)
    } else {
      await this.syncNetworkCallsWithStorage()
      this.setNextSync(this.interval)
    }
  }

  private syncNetworkCallsWithStorage = async (): Promise<void> => {
    this.syncInProgress = true
    try {
      await this.fetchAndUpdateNetworkCalls()
    } catch (e) {
      console.log(e)
    }
    this.syncInProgress = false
  }

  private fetchAndUpdateNetworkCalls = async (): Promise<void> => {
    const networkCalls = await chrome.storage.local.get(storageKey)
    this.networkCalls = { ...networkCalls, ...this.networkCalls }
    await chrome.storage.local.set({ [storageKey]: this.networkCalls })
  }

  storeNetworkCall = (hash: number, networkCall: NetworkCall) => {
    this.networkCalls[hash] = networkCall
  }

  getNetworkCall = (hash: number): NetworkCall | undefined =>
    this.networkCalls[hash]

  getNetworkCallsToSync = async (): Promise<NetworkCall[]> => {
    if (this.syncInProgress) {
      await this.sleep()
      return this.getNetworkCallsToSync()
    }
    let requestsToSync: NetworkCall[] = []
    this.syncInProgress = true
    try {
      await this.fetchAndUpdateNetworkCalls()
      requestsToSync = Object.values(this.networkCalls)
      this.networkCalls = {}
      await chrome.storage.local.set({ [storageKey]: {} })
    } catch (e) {
      console.error(e)
    }
    this.syncInProgress = false
    return requestsToSync
  }
}
