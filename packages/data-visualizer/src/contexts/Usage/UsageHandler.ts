import { GenericHandler } from '../../types/GenericHandler'

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
      if (currentUser) this.api.listenToUsage(currentUser.uid)
    }
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
    const todaysUsage = this.addUsageToUsageObject(
      usage,
      this.state.todaysUsage
    )
    const totalUsage = this.addUsageToUsageObject(usage, this.state.totalUsage)
    this.setState({ todaysUsage, totalUsage })
  }
}
