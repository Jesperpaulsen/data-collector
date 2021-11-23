import { MESSAGE_TYPES, UsageDetails, UsageReport } from '@data-collector/types'

import { getStartOfDateInUnix } from './date'
import Store from './store'

const storageKey = 'reports'

export class HabitsReporter {
  private limits = [10, 100, 500]
  private limitIndex = 0
  private reports: UsageReport[] = []
  private store: typeof Store
  private ownAveragePollution = 0
  private haveShownOwnUsageNotification = false
  private totalAveragePollution = 0
  private haveShownTotalUsageNotification = false
  private ownPollutionYesterday = 0
  private timeout?: ReturnType<typeof setTimeout>

  constructor(store: typeof Store) {
    this.store = store
    this.readLocalStorage().then((reports) => (this.reports = reports))
    this.getDailyReport()
  }

  private readLocalStorage = async (): Promise<UsageReport[]> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(storageKey, (result) => {
        resolve(result[storageKey])
      })
    })
  }

  private writeToLocalStorage = async (
    reports: UsageReport[]
  ): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [storageKey]: reports }, resolve)
    })
  }

  resetHabits = () => {
    this.limitIndex = 0
    this.haveShownOwnUsageNotification = false
    this.haveShownTotalUsageNotification = false
    this.ownAveragePollution = 0
    this.totalAveragePollution = 0
    this.ownPollutionYesterday = 0
    if (this.timeout) clearTimeout(this.timeout)
    this.getAverageUsage()
    this.timeout = setTimeout(() => {
      this.getDailyReport()
    }, 10000)
  }

  getAverageUsage = async () => {
    if (!this.store.user) return

    const averageUsageLastWeek = await this.store.api.getUsageFromLastWeek(
      this.store.user.uid
    )

    if (!averageUsageLastWeek) return

    this.ownAveragePollution = averageUsageLastWeek.ownAverageUsage
    this.totalAveragePollution = averageUsageLastWeek.allUsersAverage
    this.ownPollutionYesterday = averageUsageLastWeek.yesterdaysUsage
  }

  getReports = async () => {
    if (!this.reports.length) {
      this.reports = await this.readLocalStorage()
    }
    return this.reports
  }

  getDailyReport = async () => {
    const todaysReport: UsageReport = {
      date: getStartOfDateInUnix(new Date()),
      ownAveragePollutionLastWeek: this.ownAveragePollution,
      allAveragePollutionLastWeek: this.totalAveragePollution,
      ownPollutionYesterday: this.ownPollutionYesterday
    }
    this.reports.unshift(todaysReport)
    this.writeToLocalStorage(this.reports)
    this.sendReports()
  }

  showUsageNotification = (message: string) => {
    chrome.notifications.create({
      title: 'Update on your pollution',
      message: message,
      type: 'basic',
      iconUrl: './android-chrome-192x192.png'
    })
  }

  private updateBadge = (usage: number) => {
    const color: chrome.browserAction.ColorArray =
      usage < this.ownAveragePollution
        ? [107, 149, 92, 255]
        : [255, 127, 127, 255]
    chrome.browserAction.setBadgeBackgroundColor({ color })
    chrome.browserAction.setBadgeText({ text: `${usage.toFixed(0)} g` })
  }

  sendReports = () => {
    this.getReports().then((reports) => {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.SEND_REPORTS,
        reports: reports
      })
    })
  }

  onUsageChange = (usage: UsageDetails) => {
    const pollution = usage.CO2
    this.updateBadge(pollution)
    const limit = this.limits[this.limitIndex]
    if (pollution > limit) {
      this.limitIndex++
      this.showUsageNotification(
        `You have polluted ${pollution.toFixed(2)} grams of CO2 today`
      )
    } else if (
      !this.haveShownOwnUsageNotification &&
      usage.CO2 > this.ownAveragePollution
    ) {
      this.haveShownOwnUsageNotification = true
      this.showUsageNotification(
        `You have polluted ${pollution.toFixed(
          2
        )} grams of CO2 today. This is more than your average for the last 7 days.`
      )
    } else if (
      !this.haveShownTotalUsageNotification &&
      usage.CO2 > this.totalAveragePollution
    ) {
      this.haveShownTotalUsageNotification = true
      this.showUsageNotification(
        `You have polluted ${pollution.toFixed(
          2
        )} grams of CO2 today. This is more than the average of all the participants for the last 7 days.`
      )
    }
  }
}
