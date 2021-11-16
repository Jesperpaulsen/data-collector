import {
  BaseUsageDoc,
  NetworkCall,
  StrippedNetworkCall
} from '@data-collector/types'

import { Scheduler } from './Scheduler'
import Store from './store'

type NetworkCalls = { [hash: number]: NetworkCall }

const storageKey = 'dataStorage'

export class StorageHandler {
  private store: typeof Store
  private networkCalls: NetworkCalls = {}
  private syncInProgress = false
  private scheduler = new Scheduler(1000)

  constructor(store: typeof Store) {
    this.store = store
    this.scheduler.setCallback(this.syncNetworkCallsWithStorage)
  }

  private sleep = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 100)
    })
  }

  private syncNetworkCallsWithStorage = async (): Promise<void> => {
    if (this.syncInProgress) {
      await this.sleep()
      return this.syncNetworkCallsWithStorage()
    }
    this.syncInProgress = true
    try {
      await this.fetchAndUpdateNetworkCalls()
    } catch (e) {
      console.log(e)
    }
    this.syncInProgress = false
  }

  private readLocalStorage = async (): Promise<NetworkCalls> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(storageKey, (result) => {
        resolve(result[storageKey])
      })
    })
  }

  private writeToLocalStorage = async (
    networkCalls: NetworkCalls
  ): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [storageKey]: networkCalls }, resolve)
    })
  }

  private fetchAndUpdateNetworkCalls = async (): Promise<void> => {
    const networkCalls = await this.readLocalStorage()
    this.networkCalls = { ...networkCalls, ...this.networkCalls }
    this.writeToLocalStorage(this.networkCalls)
  }

  storeNetworkCall = (hash: number, networkCall: NetworkCall) => {
    this.networkCalls[hash] = networkCall
  }

  getNetworkCall = (hash: number): NetworkCall | undefined => {
    return this.networkCalls[hash]
  }

  getNetworkCallsToSync = async (): Promise<NetworkCalls> => {
    if (this.syncInProgress) {
      await this.sleep()
      return this.getNetworkCallsToSync()
    }
    let requestsToSync: NetworkCalls = {}
    this.syncInProgress = true
    try {
      await this.fetchAndUpdateNetworkCalls()
      requestsToSync = { ...this.networkCalls }
      this.networkCalls = {}
      await this.writeToLocalStorage({})
    } catch (e) {
      console.error(e)
    }
    this.syncInProgress = false
    return requestsToSync
  }
}
