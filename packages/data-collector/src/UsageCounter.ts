import { MESSAGE_TYPES } from '@data-collector/types'

import Store from './store'

export class UsageCounter {
  private usageToday?: number
  private usageLast7Days = 0
  private totalUsage = 0
  private usageSinceSubscriptionStarted = 0
  private store: typeof Store
  private totalCO2 = 0
  private currentDate = new Date().setHours(0, 0, 0, 0).valueOf()

  constructor(store: typeof Store) {
    this.store = store
    setTimeout(() => {
      chrome.notifications.create('', {
        title: 'Update on your usage',
        message: `You have used ${this.usageToday} bytes today`,
        type: 'basic',
        iconUrl: './android-chrome-192x192.png'
      })
    }, 5000)
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
    this.totalCO2 = userDoc.totalCO2
  }

  private listenToTodaysUsage = async () => {
    if (!this.store.user) return
    this.store.firestore.listenToTodaysUsage(
      this.store.user.uid,
      this.getDateLimit(0),
      this.handleUsageUpdate
    )
  }

  private checkIfDateHasChanged = () => {
    const now = new Date().setHours(0, 0, 0, 0).valueOf()
    if (this.currentDate !== now) {
      this.currentDate = now
      return true
    }
    return false
  }

  private handleUsageUpdate = ({
    size,
    CO2
  }: {
    size: number
    CO2: number
  }) => {
    if (this.checkIfDateHasChanged()) {
      this.usageSinceSubscriptionStarted = 0
      this.usageToday = 0
      this.usageLast7Days = 0
      this.totalUsage = 0
      this.totalCO2 = 0
      this.listenToChanges()
      return
    }
    if (!this.usageToday) this.usageToday = size
    this.usageSinceSubscriptionStarted = size - this.usageToday
    this.usageToday += this.usageSinceSubscriptionStarted
    this.usageLast7Days += this.usageSinceSubscriptionStarted
    this.totalUsage += this.usageSinceSubscriptionStarted
    this.totalCO2 = CO2
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
        usageToday: this.usageToday,
        usageLast7Days: this.usageLast7Days,
        totalUsage: this.totalUsage,
        totalCO2: this.totalCO2
      }
    })
  }
}
