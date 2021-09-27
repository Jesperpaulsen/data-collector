/**
 * The idea behind this class is to work as a cacher for network requests. Initially it will load all the network requests for a user, and then it will
 * listen to network requests that are beeing sent to the database. This is just an idea, and it might change in the future when we (most likely) change
 * the database structure
 */

import { MESSAGE_TYPES, NetworkCall } from '@data-collector/types'

import { Scheduler } from './Scheduler'
import Store from './store'

export class UsageCounter {
  private usageToday = 0
  private usageLast7Days = 0
  private totalUsage = 0
  private store: typeof Store
  private scheduler = new Scheduler(1000)

  constructor(store: typeof Store) {
    this.store = store
    this.scheduler.setCallback(this.getNetworkCallsToSync)
  }

  fetchNetworkCallsForUser = async () => {
    const res = await this.store.api.getAllNetworkCallsForUser()
    console.log(res)
    this.addNetworkCalls(res.networkCalls)
  }

  private getUsageFromNetworkCall = (networkCall: NetworkCall) => {
    const { todaysLimit, weekLimit } = this.getDayAndWeekLimit()

    if (networkCall.timestamp > todaysLimit) {
      this.usageToday += networkCall.size || 0
    }
    if (networkCall.timestamp > weekLimit) {
      this.usageLast7Days += networkCall.size || 0
    }
    this.totalUsage += networkCall.size || 0
    this.sendUsageUpdate()
  }

  private getDayAndWeekLimit = () => {
    const todaysLimit =
      Math.floor(new Date().setUTCHours(0, 0, 0, 0).valueOf()) / 100
    const weekLimit = Math.floor(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).valueOf() / 100
    )
    return { todaysLimit, weekLimit }
  }

  private getNetworkCallsToSync = async () => {
    const networkCalls =
      await this.store.storageHandler.getFilteredNetworkCalls()
    this.addNetworkCalls(networkCalls)
  }

  addNetworkCalls = (networkCalls: NetworkCall[]) => {
    for (const networkCall of networkCalls) {
      this.getUsageFromNetworkCall(networkCall)
    }
  }

  addNetworkCall = (networkCall: NetworkCall) => {
    this.getUsageFromNetworkCall(networkCall)
  }

  sendUsageUpdate = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.SYNC_REQUESTS,
      payload: {
        usageToday: this.usageToday,
        usageLast7Days: this.usageLast7Days,
        totalUsage: this.totalUsage
      }
    })
  }
}
