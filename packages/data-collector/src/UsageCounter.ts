import { MESSAGE_TYPES } from '@data-collector/types'

import Store from './store'

export class UsageCounter {
  private usageToday?: number
  private usageLast7Days = 0
  private totalUsage = 0
  private usageSinceSubscriptionStarted = 0
  private store: typeof Store

  constructor(store: typeof Store) {
    this.store = store
  }

  private getUsageLast7Days = async () => {
    const dateLimit = this.getDateLimit(7)
    if (!this.store.user) return
    this.usageLast7Days = await this.store.firestore.getUsageForPreviousDates(
      this.store.user?.uid,
      dateLimit
    )
  }

  private getTotalUsage = async () => {
    if (!this.store.user) return
    const userDoc = await this.store.firestore.getUserDoc(this.store.user.uid)
    this.totalUsage = userDoc.totalSize
  }

  private listenToTodaysUsage = async () => {
    if (!this.store.user) return
    this.store.firestore.listenToTodaysUsage(
      this.store.user.uid,
      this.getDateLimit(0),
      this.handleUsageUpdate
    )
  }

  private handleUsageUpdate = (usage: number) => {
    if (!this.usageToday) this.usageToday = usage
    this.usageSinceSubscriptionStarted = usage - this.usageToday
    this.sendUsageUpdate()
  }

  private getDateLimit = (numberOfDaysToSubtract: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dateToCompare = new Date()
    dateToCompare.setDate(today.getDate() - numberOfDaysToSubtract)
    dateToCompare.setHours(0, 0, 0, 0)
    return dateToCompare.valueOf() / 1000
  }

  listenToChanges = async () => {
    const promises = [this.getUsageLast7Days(), this.getTotalUsage()]
    await Promise.all(promises)
    this.listenToTodaysUsage()
  }

  sendUsageUpdate = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.SYNC_REQUESTS,
      payload: {
        usageToday: (this.usageToday || 0) + this.usageSinceSubscriptionStarted,
        usageLast7Days:
          this.usageLast7Days + this.usageSinceSubscriptionStarted,
        totalUsage: this.totalUsage + this.usageSinceSubscriptionStarted
      }
    })
  }
}
