import { GenericHandler } from '../../types/GenericHandler'
import User from '../../types/User'

import { UsageApi } from './UsageApi'
import { UsageDetails, UsageState } from './UsageState'

export class UsageHandler extends GenericHandler<UsageState> {
  private api = new UsageApi(this)

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
    console.log(currentUser)
    const todaysUsage: UsageDetails = {
      size: currentUser.totalSize,
      CO2: currentUser.totalCO2,
      KWH: currentUser.totalKWH
    }
    this.setState({ todaysUsage })
    console.log(this.state)
  }

  private addUsageToUsageObject = (
    usage: UsageDetails,
    usageObject: UsageDetails
  ) => {
    const res = { ...usageObject }
    for (const [key, value] of Object.entries(usage)) {
      res[key] = value + res[key]
    }
    return res
  }

  readonly handleUsageUpdate = (usage: UsageDetails) => {
    // console.log(this.state)
    const totalUsage = this.addUsageToUsageObject(usage, this.state.totalUsage)
    this.setState({ todaysUsage: usage, totalUsage })
  }
}
