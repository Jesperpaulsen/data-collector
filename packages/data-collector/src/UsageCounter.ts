import { MESSAGE_TYPES, UsageDetails } from '@data-collector/types'

import Store from './store'
import { accUsageDetails } from './utils'

const initialUsage: UsageDetails = {
  size: 0,
  KWH: 0,
  CO2: 0
}
export class UsageCounter {
  private todaysUsage: UsageDetails = initialUsage
  private totalUsage: UsageDetails = initialUsage
  private lastUsage: UsageDetails = initialUsage
  private store: typeof Store
  private currentDate = new Date().setHours(0, 0, 0, 0).valueOf()

  constructor(store: typeof Store) {
    this.store = store
    /* setTimeout(() => {
      chrome.notifications.create('', {
        title: 'Update on your usage',
        message: `You have used ${this.usageToday} bytes today`,
        type: 'basic',
        iconUrl: './android-chrome-192x192.png'
      })
    }, 5000) */
  }

  private getTotalUsage = async () => {
    if (!this.store.user) return
    const userDoc = await this.store.firestore.getUserDoc(this.store.user.uid)
    this.totalUsage = {
      CO2: userDoc.totalCO2 as any,
      KWH: userDoc.totalKWH as any,
      size: userDoc.totalSize as any
    }
    this.lastUsage = this.totalUsage
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

  private handleUsageUpdate = (usage: UsageDetails) => {
    const totalUsageDifference: UsageDetails = {
      CO2: usage.CO2 - this.lastUsage.CO2,
      KWH: usage.KWH - this.lastUsage.KWH,
      size: usage.size - this.lastUsage.size
    }
    const totalUsage = accUsageDetails(totalUsageDifference, this.totalUsage)
    this.lastUsage = usage
    this.todaysUsage = usage
    this.totalUsage = totalUsage
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
    await this.getTotalUsage()
    this.listenToTodaysUsage()
  }

  sendUsageUpdate = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.SYNC_REQUESTS,
      payload: {
        totalUsage: this.totalUsage,
        todaysUsage: this.todaysUsage
      }
    })
  }
}
