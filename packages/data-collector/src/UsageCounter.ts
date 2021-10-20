import { MESSAGE_TYPES, UsageDetails } from '@data-collector/types'

import { getStartOfDateInUnix } from './date'
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
  private ownUsageLastWeek: { [date: number]: UsageDetails } = {}
  private store: typeof Store
  private currentDate = getStartOfDateInUnix(new Date())
  private dateChangeInProgess = false

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
      getStartOfDateInUnix(new Date()),
      this.handleUsageUpdate
    )
  }

  private checkIfDateHasChanged = () => {
    const today = getStartOfDateInUnix(new Date())
    if (this.currentDate !== today) {
      console.log('Date has changed')
      this.currentDate = today
      return true
    }
    return false
  }

  private resetData = async () => {
    this.dateChangeInProgess = true
    this.todaysUsage = initialUsage
    this.ownUsageLastWeek = {}
    await this.listenToTodaysUsage()
    await this.store.api.reportUserActive()
    await this.getUsageFromLastWeek()
    this.dateChangeInProgess = false
  }

  private getUsageFromLastWeek = async () => {
    const userId = this.store.user?.uid
    if (!userId) return
    const usage = await this.store.firestore.getOwnUsageFromLastWeek(userId)
    this.ownUsageLastWeek = usage
  }

  private handleUsageUpdate = async (usage: UsageDetails) => {
    if (this.checkIfDateHasChanged() || this.dateChangeInProgess) {
      if (!this.dateChangeInProgess) await this.resetData()
      return
    }

    const totalUsageDifference: UsageDetails = {
      CO2: Math.max(usage.CO2 - this.lastUsage.CO2, 0),
      KWH: Math.max(usage.KWH - this.lastUsage.KWH, 0),
      size: Math.max(usage.size - this.lastUsage.size, 0)
    }

    const totalUsage = accUsageDetails(totalUsageDifference, this.totalUsage)
    const today = getStartOfDateInUnix(new Date())
    this.ownUsageLastWeek[today] = usage
    this.lastUsage = usage
    this.todaysUsage = usage
    this.totalUsage = totalUsage
    this.sendUsageUpdate()
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
        todaysUsage: this.todaysUsage,
        ownUsageLastWeek: this.ownUsageLastWeek
      }
    })
  }
}
