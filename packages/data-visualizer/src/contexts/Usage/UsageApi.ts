import Firestore from '../../services/Firestore'
import { HTTPClient } from '../../services/HttpClient'
import { CountryDoc } from '../../types/country-doc'
import { HostDoc } from '../../types/host-doc'
import { HostToCountry } from '../../types/host-to-country'
import { accUsageDetails } from '../../utils/accUsageDetails'
import { getStartOfDateInUnix } from '../../utils/date'

import { UsageHandler } from './UsageHandler'
import { UsageDetails } from './UsageState'

export class UsageApi {
  private usageHandler: UsageHandler
  private HTTPClient?: HTTPClient

  constructor(usageHandler: UsageHandler) {
    this.usageHandler = usageHandler
  }

  createHTTPClient = (getUserToken: () => Promise<string>) => {
    this.HTTPClient = new HTTPClient(getUserToken)
    this.getTotalUsageForLastWeek()
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

  getUsageByHost = async (userId: string) => {
    try {
      const snapshot = await Firestore.getUsageByHostForUser(userId)
      const res: { [uid: string]: HostDoc } = {}
      for (const doc of snapshot.docs) {
        const data = doc.data() as HostDoc
        const exististingCountry = res[data.hostOrigin]
        if (exististingCountry) {
          const usage: UsageDetails = {
            CO2: data.CO2,
            KWH: data.KWH,
            size: data.size,
            numberOfCalls: data.numberOfCalls,
            numberOfCallsWithoutSize: data.numberOfCallsWithoutSize
          }
          console.log(usage.CO2)
          const updatedCountryDoc = accUsageDetails<HostDoc>(
            usage,
            exististingCountry
          )
          res[data.hostOrigin] = updatedCountryDoc
        } else {
          res[data.hostOrigin] = data
        }
      }
      return res
    } catch (e) {
      console.log(e)
      return {}
    }
  }

  getCountryUsagePerHost = async (userId: string, countryName: string) => {
    try {
      const snapshot = await Firestore.getCountryUsagePerHost(
        userId,
        countryName
      )
      const res: HostToCountry[] = []
      for (const doc of snapshot.docs) {
        const data = doc.data() as HostToCountry
        res.push(data)
      }
      return res
    } catch (e) {
      console.log(e)
      return []
    }
  }

  getTotalUsageForLastWeek = async () => {
    try {
      const res = await this.HTTPClient?.doRequest(
        '/network-call/total-usage/7',
        'GET'
      )
      const { usage, numberOfUsers } = await res?.json()
      console.log(usage)
      this.usageHandler.setState({
        numberOfUsers,
        allUsersUsageLastWeek: usage
      })
    } catch (e) {
      console.log(e)
      return []
    }
  }

  getOwnUsageForLastWeek = async (userId: string, dateLimit: number) => {
    return Firestore.getUsageForPreviousDates(userId, dateLimit)
  }
}
