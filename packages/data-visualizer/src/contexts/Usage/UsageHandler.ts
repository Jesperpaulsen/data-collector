import { GenericHandler } from '../../types/GenericHandler'
import { HostToCountry } from '../../types/host-to-country'
import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES'
import User from '../../types/User'
import { accUsageDetails } from '../../utils/accUsageDetails'
import { getDateLimit, getStartOfDateInUnix } from '../../utils/date'
import { extensionID } from '../../utils/extensionID'

import { UsageApi } from './UsageApi'
import { UsageDetails, UsageState } from './UsageState'

export class UsageHandler extends GenericHandler<UsageState> {
  private api = new UsageApi(this)
  private lastUsage: UsageDetails = {
    CO2: 0,
    kWh: 0,
    size: 0
  }

  override onStateUpdated = async (
    oldState: UsageState,
    newState: UsageState
  ) => {
    if (!oldState.userState?.currentUser && newState.userState?.currentUser) {
      const currentUser = newState.userState?.currentUser
      if (currentUser) {
        this.setTotalUsage(currentUser)
        this.api.listenToUsage(currentUser.uid)
        this.getOwnUsageFromLastWeek(currentUser.uid)
        if (!newState.aliasMap.size) this.getHostAliasMap()
        if (newState.userHandler) {
          this.api.createHTTPClient(newState.userHandler.getUserToken)
        }
      }
    }
  }

  private setTotalUsage = (currentUser: User) => {
    const totalUsage: UsageDetails = {
      size: currentUser.totalSize,
      CO2: currentUser.totalCO2,
      kWh: currentUser.totalkWh
    }
    this.setState({ totalUsage })
    this.lastUsage = totalUsage
  }

  readonly handleUsageUpdate = (usage: UsageDetails) => {
    const totalUsageDifference: UsageDetails = {
      CO2: Math.max(usage.CO2 - this.lastUsage.CO2, 0),
      kWh: Math.max(usage.kWh - this.lastUsage.kWh, 0),
      size: Math.max(usage.size - this.lastUsage.size, 0)
    }

    const totalUsage = accUsageDetails(
      totalUsageDifference,
      this.state.totalUsage
    )
    this.updateLastDayInOwnUsage(usage)
    this.lastUsage = usage
    this.setState({ todaysUsage: usage, totalUsage })
  }

  private updateLastDayInOwnUsage = (usage: UsageDetails) => {
    const today = getStartOfDateInUnix(new Date())
    const tmpUsage = { ...this.state.ownUsageLastWeek }
    tmpUsage[today] = usage
    this.setState({ ownUsageLastWeek: tmpUsage })
  }

  getUsageByCountry = async () => {
    const currentUser = this.state.userState?.currentUser
    if (!currentUser) return
    // await this.getHostAliasMap()
    const usageByCountry = await this.api.getUsageByCountry(currentUser.uid)
    this.setState({ usageByCountry })
  }

  getUsageByHost = async () => {
    const currentUser = this.state.userState?.currentUser
    if (!currentUser) return
    // await this.getHostAliasMap()
    const { accumulated, usageByHostUid } = await this.api.getUsageByHost(
      currentUser.uid
    )
    this.setState({
      accumulatedUsageByHost: accumulated,
      usageByHost: usageByHostUid
    })
  }

  getCountryUsagePerHost = async (countryCode: string) => {
    const currentUser = this.state.userState?.currentUser
    if (!currentUser) return []
    const countryUsagePerHost = await this.api.getCountryUsagePerHost(
      currentUser.uid,
      countryCode
    )
    return countryUsagePerHost
  }

  getCountryForHost = async (hostAlias: string) => {
    const currentUser = this.state.userState?.currentUser
    if (!currentUser) return {}
    const countryForHost = await this.api.getCountryForHost(
      currentUser.uid,
      hostAlias
    )
    return countryForHost
  }

  getOwnUsageFromLastWeek = async (userId: string) => {
    const lastWeekLimit = getDateLimit(7)
    const usage = await this.api.getOwnUsageForLastWeek(userId, lastWeekLimit)
    this.setState({ ownUsageLastWeek: usage })
  }

  refreshUsageFromLastWeek = async () => {
    const currentUser = this.state.userState?.currentUser
    if (!currentUser) return
    this.getOwnUsageFromLastWeek(currentUser.uid)
    this.api.getTotalUsageForLastWeek()
  }

  private getHostAliasMap = async () => {
    const aliasArray = await this.requestHostAliasArray()
    const aliasMap = new Map(aliasArray)
    this.setState({ aliasMap })
  }

  private requestHostAliasArray = (): Promise<[string, string][]> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        extensionID,
        { type: MESSAGE_TYPES.REQUEST_HOST_ALIAS_ARRAY },
        (response) => {
          resolve(response)
        }
      )
    })
  }
}
