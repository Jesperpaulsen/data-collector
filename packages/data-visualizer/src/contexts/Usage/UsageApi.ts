import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES'
import { HTTPClient } from '../../services/HttpClient'
import { extensionID } from '../../utils/extensionID'
import { UsageHandler } from './UsageHandler'
import Firestore from '../../services/Firestore'
import { getStartOfDateInUnix } from '../../utils/date'

export class UsageApi {
  private usageHandler: UsageHandler

  constructor(usageHandler: UsageHandler) {
    this.usageHandler = usageHandler
  }

  listenToUsage = (userId: string) => {
    const today = getStartOfDateInUnix(new Date())
    Firestore.listenToTodaysUsage(
      userId,
      today,
      this.usageHandler.handleUsageUpdate
    )
  }
}
