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
            kWh: data.kWh,
            size: data.size,
            numberOfCalls: data.numberOfCalls,
            numberOfCallsWithoutSize: data.numberOfCallsWithoutSize
          }
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
    const accumulated: { [uid: string]: HostDoc } = {}
    const usageByHostUid: { [uid: string]: HostDoc } = {}
    try {
      const snapshot = await Firestore.getUsageByHostForUser(userId)
      for (const doc of snapshot.docs) {
        const data = doc.data() as HostDoc
        usageByHostUid[data.uid] = data
        const exististingCountry = accumulated[data.hostOrigin]
        if (exististingCountry) {
          const usage: UsageDetails = {
            CO2: data.CO2,
            kWh: data.kWh,
            size: data.size,
            numberOfCalls: data.numberOfCalls,
            numberOfCallsWithoutSize: data.numberOfCallsWithoutSize
          }
          const updatedCountryDoc = accUsageDetails<HostDoc>(
            usage,
            exististingCountry
          )
          accumulated[data.hostOrigin] = updatedCountryDoc
        } else {
          accumulated[data.hostOrigin] = data
        }
      }
    } catch (e) {
      console.log(e)
    }
    return { accumulated, usageByHostUid }
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

  getCountryForHost = async (userId: string, hostOrigin: string) => {
    try {
      const snapshot = await Firestore.getCountryForHost(userId, hostOrigin)
      const res: { [country: string]: HostToCountry } = {}
      for (const doc of snapshot.docs) {
        const data = doc.data() as HostToCountry
        res[data.countryCode] = data
      }
      return res
    } catch (e) {
      console.log(e)
      return {}
    }
  }

  getTotalUsageForLastWeek = async () => {
    try {
      const res = await this.HTTPClient?.doRequest(
        '/network-call/total-usage/7',
        'GET'
      )
      const { usage } = await res?.json()
      this.usageHandler.setState({
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
