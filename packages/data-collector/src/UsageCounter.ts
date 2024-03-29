import { MESSAGE_TYPES, UsageDetails } from '@data-collector/types'

import { co2Formatter } from './co2Formatter'
import { getStartOfDateInUnix } from './date'
import Store from './store'
import { accUsageDetails } from './utils'

const initialUsage: UsageDetails = {
  size: 0,
  kWh: 0,
  CO2: 0,
  secondsActive: 0
}
export class UsageCounter {
  private todaysUsage: UsageDetails = initialUsage
  private totalUsage: UsageDetails = initialUsage
  private lastUsage: UsageDetails = initialUsage
  ownUsageLastWeek: { [date: number]: UsageDetails } = {}
  private store: typeof Store
  private dateChangeInProgess = false

  constructor(store: typeof Store) {
    this.store = store
  }

  private getTotalUsage = async () => {
    if (!this.store.user) return
    const userDoc = await this.store.firestore.getUserDoc(this.store.user.uid)
    this.totalUsage = {
      CO2: userDoc.totalCO2 as any,
      kWh: userDoc.totalkWh as any,
      size: userDoc.totalSize as any,
      secondsActive: userDoc.secondsActive as any
    }
    this.lastUsage = this.totalUsage
  }

  private listenToTodaysUsage = () => {
    if (!this.store.user) return
    this.store.firestore.listenToTodaysUsage(
      this.store.user.uid,
      getStartOfDateInUnix(new Date()),
      this.handleUsageUpdate
    )
  }

  resetData = async () => {
    this.dateChangeInProgess = true
    this.todaysUsage = initialUsage
    this.ownUsageLastWeek = {}
    await this.getUsageFromLastWeek()
    this.dateChangeInProgess = false
    this.listenToTodaysUsage()
  }

  private getUsageFromLastWeek = async () => {
    const userId = this.store.user?.uid
    if (!userId) return
    const usage = await this.store.firestore.getOwnUsageFromLastWeek(userId)
    this.ownUsageLastWeek = usage
  }

  private handleUsageUpdate = async (usage: UsageDetails) => {
    if (this.dateChangeInProgess) {
      return
    }

    const totalUsageDifference: UsageDetails = {
      CO2: Math.max(usage.CO2 - this.lastUsage.CO2, 0),
      kWh: Math.max(usage.kWh - this.lastUsage.kWh, 0),
      size: Math.max(usage.size - this.lastUsage.size, 0),
      secondsActive: Math.max(
        (usage.secondsActive || 0) - (this.lastUsage.secondsActive || 0),
        0
      )
    }

    const totalUsage = accUsageDetails(totalUsageDifference, this.totalUsage)
    const today = getStartOfDateInUnix(new Date())
    this.ownUsageLastWeek[today] = usage
    this.lastUsage = usage
    this.todaysUsage = usage
    this.totalUsage = totalUsage
    this.sendUsageUpdate()
    this.store.habitsReporter.onUsageChange(this.todaysUsage)
  }

  listenToChanges = async () => {
    await this.getTotalUsage()
    this.resetData()
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
