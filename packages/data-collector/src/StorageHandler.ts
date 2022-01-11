import {
  BaseUsageDoc,
  NetworkCall,
  StrippedNetworkCall
} from '@data-collector/types'

import { Scheduler } from './Scheduler'
import Store from './store'

type NetworkCalls = { [hash: number]: NetworkCall }
type AnonymizedHosts = { [host: string]: string }

const networkCallKey = 'dataStorage'
const hostsKey = 'anonymizedHosts'

export class StorageHandler {
  private store: typeof Store
  private networkCalls: NetworkCalls = {}
  private hostMap: AnonymizedHosts = {}
  private syncInProgress = false
  private scheduler = new Scheduler(1000)

  constructor(store: typeof Store) {
    this.store = store
    this.scheduler.setCallback(this.syncWithStorage)
  }

  private sleep = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 100)
    })
  }

  private syncWithStorage = async (): Promise<void> => {
    if (this.syncInProgress) {
      await this.sleep()
      return this.syncWithStorage()
    }
    this.syncInProgress = true
    try {
      await this.fetchAndUpdateNetworkCalls()
      await this.fetchAndUpdateHosts()
    } catch (e) {
      console.log(e)
    }
    this.syncInProgress = false
  }

  private readLocalStorage = async (
    storageKey: string
  ): Promise<NetworkCalls> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(storageKey, (result) => {
        resolve(result[storageKey] || [])
      })
    })
  }

  private writeToLocalStorage = async <T>(
    storageKey: string,
    data: T
  ): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [storageKey]: data }, resolve)
    })
  }

  private fetchAndUpdateHosts = async (): Promise<void> => {
    const hosts = await this.readLocalStorage(hostsKey)
    this.hostMap = { ...hosts, ...this.hostMap }
    this.writeToLocalStorage<AnonymizedHosts>(hostsKey, this.hostMap)
  }

  private fetchAndUpdateNetworkCalls = async (): Promise<void> => {
    const networkCalls = await this.readLocalStorage(networkCallKey)
    this.networkCalls = { ...networkCalls, ...this.networkCalls }
    this.writeToLocalStorage<NetworkCalls>(networkCallKey, this.networkCalls)
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
      await this.writeToLocalStorage(networkCallKey, {})
    } catch (e) {
      console.error(e)
    }
    this.syncInProgress = false
    return requestsToSync
  }

  storeHost = (hostName: string, alias: string) => {
    this.hostMap[hostName] = alias
  }

  getHostAlias = (hostName: string) => {
    return this.hostMap[hostName]
  }

  getAnonymizedHosts = async (): Promise<AnonymizedHosts> => {
    if (this.syncInProgress) {
      await this.sleep()
      return this.getAnonymizedHosts()
    }
    let hosts: AnonymizedHosts = {}
    this.syncInProgress = true
    try {
      await this.fetchAndUpdateHosts()
      hosts = { ...this.hostMap }
    } catch (e) {
      console.error(e)
    }
    this.syncInProgress = false
    return hosts
  }
}
