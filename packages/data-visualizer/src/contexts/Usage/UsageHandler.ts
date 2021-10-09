import { GenericHandler } from '../../types/GenericHandler'
import User from '../../types/User'
import { accUsageDetails } from '../../utils/accUsageDetails'

import { UsageApi } from './UsageApi'
import { UsageDetails, UsageState } from './UsageState'

export class UsageHandler extends GenericHandler<UsageState> {
  private api = new UsageApi(this)
  private lastUsage: UsageDetails = {
    CO2: 0,
    KWH: 0,
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
      }
    }
  }

  private setTotalUsage = (currentUser: User) => {
    const totalUsage: UsageDetails = {
      size: currentUser.totalSize,
      CO2: currentUser.totalCO2,
      KWH: currentUser.totalKWH
    }
    this.setState({ totalUsage })
    console.log(this.state.totalUsage)
  }

  readonly handleUsageUpdate = (usage: UsageDetails) => {
    const totalUsageDifference: UsageDetails = {
      CO2: usage.CO2 - this.lastUsage.CO2,
      KWH: usage.KWH - this.lastUsage.KWH,
      size: usage.size - this.lastUsage.size
    }
    const totalUsage = accUsageDetails(
      totalUsageDifference,
      this.state.totalUsage
    )
    this.lastUsage = usage
    this.setState({ todaysUsage: usage, totalUsage })
  }

  getUsageByCountry = async () => {
    const currentUser = this.state.userState?.currentUser
    if (!currentUser) return
    const usageByCountry = await this.api.getUsageByCountry(currentUser.uid)
    console.log(usageByCountry)
    this.setState({ usageByCountry })
  }
}
