import Firestore from '../../services/Firestore'
import { HTTPClient } from '../../services/HttpClient'
import { CountryDoc } from '../../types/country-doc'
import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES'
import { accUsageDetails } from '../../utils/accUsageDetails'
import { getStartOfDateInUnix } from '../../utils/date'
import { extensionID } from '../../utils/extensionID'

import { UsageHandler } from './UsageHandler'
import { UsageDetails } from './UsageState'

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

  getUsageByCountry = async (userId: string) => {
    try {
      const snapshot = await Firestore.getUsageByCountryForUser(userId)
      const res: { [uid: string]: CountryDoc } = {}
      for (const doc of snapshot.docs) {
        const data = doc.data() as CountryDoc
        const exististingCountry = res[data.countryCode]
        if (exististingCountry) {
          const usage: UsageDetails = {
            CO2: data.CO2,
            KWH: data.KWH,
            size: data.size,
            numberOfCalls: data.numberOfCalls,
            numberOfCallsWithoutSize: data.numberOfCallsWithoutSize
          }
          console.log(usage.CO2)
          const updatedCountryDoc = accUsageDetails<CountryDoc>(
            usage,
            exististingCountry
          )
          res[data.countryCode] = updatedCountryDoc
        } else {
          res[data.countryCode] = data
        }
      }
      return res
    } catch (e) {
      console.log(e)
      return {}
    }
  }
}
