import { MESSAGE_TYPES, UsageDetails, UsageReport } from '@data-collector/types'

import { getDateLimit, getStartOfDateInUnix } from './date'
import Store from './store'

const storageKey = 'reports'

type Reports = { [date: number]: UsageReport }

export class HabitsReporter {
  private limits = [10, 100, 500]
  private limitIndex = 0
  private reports: Reports = {}
  private store: typeof Store
  private ownAveragePollution = 0
  private haveShownOwnUsageNotification = false
  private totalAveragePollution = 0
  private haveShownTotalUsageNotification = false
  private ownPollutionYesterday = 0
  private timeout?: ReturnType<typeof setTimeout>
  private lastNotification = 0

  constructor(store: typeof Store) {
    this.store = store
    this.readLocalStorage().then((reports) => {
      if (!this.reports) return
      this.reports = reports
      this.sendReports()
    })
    this.getDailyReport()
  }

  private readLocalStorage = async (): Promise<Reports> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(storageKey, (result) => {
        resolve(result[storageKey])
      })
    })
  }

  private writeToLocalStorage = async (reports: Reports): Promise<void> => {
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
    this.totalAveragePollution = averageUsageLastWeek.allUsersAverageUsage
    this.ownPollutionYesterday = averageUsageLastWeek.yesterdaysUsage
    this.getDailyReport()
  }

  getReports = async () => {
    if (!this.reports || !Object.keys(this.reports).length) {
      const reports = await this.readLocalStorage()
      this.reports = reports || {}
    }
    return this.reports
  }

  getDailyReport = () => {
    const todaysReport: UsageReport = {
      date: getDateLimit(1),
      ownAveragePollutionLastWeek: this.ownAveragePollution,
      allAveragePollutionLastWeek: this.totalAveragePollution,
      ownPollutionYesterday: this.ownPollutionYesterday
    }
    this.reports[todaysReport.date] = todaysReport
    this.writeToLocalStorage(this.reports)
    this.sendReports()
  }

  showUsageNotification = (message: string) => {
    const now = Date.now()
    if (now - this.lastNotification < 4000) {
      this.lastNotification = now
      return
    }
    this.lastNotification = now
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
        payload: {
          reports: Object.values(reports).sort(
            (reportA, reportB) => reportB.date - reportA.date
          )
        }
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
