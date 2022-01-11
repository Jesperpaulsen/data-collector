import {
  BaseUsageDoc,
  BaseUsageDocResponse,
  CountryDoc,
  HostDoc,
  HostToCountry,
  User,
  StrippedNetworkCall,
  ActiveUserDoc,
  NetworkCall,
  UsageDetails
} from '@data-collector/types'
import admin from 'firebase-admin'
import Country from './country'
import { getDateLimit, getStartOfDateInUnix } from '../utils/date'
import { USAGE_TYPES } from '../types/USAGE_TYPES'
import { Firestore } from './firestore'

import Big from 'big.js'

const DEVICE_CO2_PER_10_SEC = 0.3

type CollectionType =
  admin.firestore.CollectionReference<admin.firestore.DocumentData>
export class NetworkCallController {
  private hostCollection: CollectionType
  private countryCollection: CollectionType
  usageCollection: CollectionType
  private hostToCountryCollection: CollectionType
  private totalUsageCollection: CollectionType
  private activeUsersCollection: CollectionType
  private firestore: Firestore

  constructor(
    firestore: Firestore,
    hostCollection: CollectionType,
    countryCollection: CollectionType,
    usageCollection: CollectionType,
    hostToCountryCollection: CollectionType,
    totalUsageCollection: CollectionType,
    activeUsersCollection: CollectionType
  ) {
    this.firestore = firestore
    this.hostCollection = hostCollection
    this.countryCollection = countryCollection
    this.usageCollection = usageCollection
    this.hostToCountryCollection = hostToCountryCollection
    this.totalUsageCollection = totalUsageCollection
    this.activeUsersCollection = activeUsersCollection
  }

  getAllNetworkCalls = async () => {
    const promises = [
      this.hostCollection.get(),
      this.countryCollection.get(),
      this.usageCollection.get(),
      this.hostToCountryCollection.get()
    ]
    const [hostDocs, countryDocs, usageDocs, hostToCountryCollection] =
      await Promise.all(promises)
    return [
      ...hostDocs.docs,
      ...countryDocs.docs,
      ...usageDocs.docs,
      ...hostToCountryCollection.docs
    ]
  }

  getCollection = (type: USAGE_TYPES) => {
    return type === USAGE_TYPES.COUNTRY
      ? this.countryCollection
      : this.hostCollection
  }

  getTotalUsageAfterDate = async (dateLimit: number) => {
    const res: BaseUsageDocResponse[] = []
    try {
      const snapshot = await this.totalUsageCollection
        .where('date', '>', dateLimit)
        .get()

      for (const doc of snapshot.docs) {
        res.push(doc.data() as BaseUsageDocResponse)
      }
    } catch (e) {
      console.log(e)
    }
    return res
  }

  getNetworkCallsForUser = async (uid: string) => {
    const promises = [
      this.hostCollection.where('userId', '==', uid).get(),
      this.countryCollection.where('userId', '==', uid).get(),
      this.usageCollection.where('userId', '==', uid).get(),
      this.hostToCountryCollection.where('userId', '==', uid).get()
    ]
    const [
      hostCollection,
      countryCollection,
      usageCollection,
      hostToCountryCollection
    ] = await Promise.all(promises)

    const res: BaseUsageDocResponse[] = []

    const networkCalls = [
      ...hostCollection.docs,
      ...countryCollection.docs,
      ...usageCollection.docs,
      ...hostToCountryCollection.docs
    ]

    for (const doc of networkCalls) {
      res.push(doc.data() as BaseUsageDocResponse)
    }

    return res
  }

  getDocId = ({
    identifier,
    userId,
    date
  }: {
    identifier?: string
    userId?: string
    date?: number
  }) => {
    if (identifier?.length && date && userId) {
      return `${userId}-${identifier}-${date}`
    } else if (identifier?.length && userId) {
      return `${userId}-${identifier}`
    } else if (identifier?.length && date) {
      return `${identifier}-${date}`
    } else if (userId && date) {
      return `${userId}-${date}`
    } else if (identifier?.length) {
      return identifier
    } else if (date) {
      return String(date)
    }
    return `unkown-${getStartOfDateInUnix(new Date())}`
  }

  private getFieldValue = (numberOfIncrements: number) => {
    return admin.firestore.FieldValue.increment(numberOfIncrements)
  }

  updateUserStats = async (networkCall: BaseUsageDoc) => {
    const fieldsToUpdate: Pick<
      User,
      'totalCO2' | 'totalSize' | 'totalkWh' | 'numberOfCalls' | 'secondsActive'
    > = {
      totalSize: networkCall.size,
      totalCO2: networkCall.CO2,
      totalkWh: networkCall.kWh,
      numberOfCalls: networkCall.numberOfCalls,
      secondsActive: networkCall.secondsActive
    }
    return this.firestore.updateUser(networkCall.userId, fieldsToUpdate)
  }

  setHostDoc = async (
    networkCall: BaseUsageDoc,
    hostOrigin: string,
    usageId: string
  ) => {
    const uid = this.getDocId({
      identifier: hostOrigin,
      date: networkCall.date,
      userId: networkCall.userId
    })
    const hostDoc: HostDoc = {
      ...networkCall,
      hostOrigin,
      usageId,
      type: USAGE_TYPES.HOST,
      uid
    }
    return this.hostCollection.doc(uid).set(hostDoc, { merge: true })
  }

  setCountryDoc = async (
    networkCall: BaseUsageDoc,
    countryCode: string,
    countryName: string,
    usageId: string
  ) => {
    const uid = this.getDocId({
      identifier: countryCode,
      date: networkCall.date,
      userId: networkCall.userId
    })
    const countryDoc: CountryDoc = {
      ...networkCall,
      countryCode,
      countryName,
      usageId,
      type: USAGE_TYPES.COUNTRY,
      uid
    }

    return this.countryCollection.doc(uid).set(countryDoc, { merge: true })
  }

  setUsageDoc = async (networkCall: BaseUsageDoc) => {
    return this.usageCollection
      .doc(networkCall.uid)
      .set(networkCall, { merge: true })
  }

  setHostToCountryDoc = async (
    networkCall: BaseUsageDoc,
    countryCode: string,
    countryName: string,
    hostOrigin: string
  ) => {
    const uid = this.getDocId({
      identifier: `${countryCode}-${hostOrigin}`,
      userId: networkCall.userId
    })
    const tmpNetworkCall = { ...networkCall }
    // @ts-ignore
    delete tmpNetworkCall.date

    const hostToCountryDoc: HostToCountry = {
      ...tmpNetworkCall,
      countryCode,
      countryName,
      hostOrigin
    }

    return this.hostToCountryCollection
      .doc(uid)
      .set(hostToCountryDoc, { merge: true })
  }

  updateTotalUsage = (networkCall: BaseUsageDoc) => {
    const uid = this.getDocId({ date: networkCall.date })
    const tmpNetworkCall = { ...networkCall, uid }
    // @ts-ignore
    delete tmpNetworkCall.userId
    return this.totalUsageCollection
      .doc(uid)
      .set(tmpNetworkCall, { merge: true })
  }

  storeNetworkCall = async (
    baseUsageDoc: BaseUsageDoc,
    networkCall: StrippedNetworkCall,
    userId: string
  ) => {
    const { targetIP, hostOrigin } = networkCall

    const date = getStartOfDateInUnix(new Date())
    const { countryCode, countryName } = Country.getCountry(targetIP)
    const usageId = this.getDocId({ userId, date })

    const promises = [
      this.setHostDoc(baseUsageDoc, hostOrigin, usageId),
      this.setCountryDoc(baseUsageDoc, countryCode, countryName, usageId)
    ]

    if (hostOrigin.length && countryCode) {
      promises.push(
        this.setHostToCountryDoc(
          baseUsageDoc,
          countryCode,
          countryName,
          hostOrigin
        )
      )
    }

    try {
      await Promise.all(promises)
    } catch (e) {
      console.log(e)
    }
  }

  updateUserDocs = async (baseUsageDoc: BaseUsageDoc) => {
    const promises = [
      this.updateUserStats(baseUsageDoc),
      this.setUsageDoc(baseUsageDoc),
      this.updateTotalUsage(baseUsageDoc)
    ]

    try {
      await Promise.all(promises)
    } catch (e) {
      console.log(e)
    }
  }

  getUsageDetailsFromNetworkCall = (
    networkCall: StrippedNetworkCall
  ): UsageDetails => {
    const { size, targetIP } = networkCall
    const { countryCode } = Country.getCountry(targetIP)

    const { CO2, kWh } = Country.calculateEmission({ size, countryCode })

    return {
      CO2,
      kWh,
      size: size || 0,
      numberOfCalls: 1,
      numberOfCallsWithoutSize: size ? 0 : 1
    }
  }

  getBaseUsageDoc = (usageDetails: UsageDetails, userId: string) => {
    const date = getStartOfDateInUnix(new Date())
    const usageId = this.getDocId({ userId, date })

    const baseUsageDoc: BaseUsageDoc = {
      uid: usageId,
      CO2: this.getFieldValue(usageDetails.CO2),
      kWh: this.getFieldValue(usageDetails.kWh),
      date,
      numberOfCalls: this.getFieldValue(usageDetails.numberOfCalls || 1),
      numberOfCallsWithoutSize: this.getFieldValue(
        usageDetails.numberOfCallsWithoutSize || usageDetails.size ? 0 : 1
      ),
      size: this.getFieldValue(usageDetails.size || 0),
      userId,
      secondsActive: this.getFieldValue(usageDetails.secondsActive || 0),
      type: USAGE_TYPES.USAGE
    }
    return baseUsageDoc
  }

  handleNetworkCalls = async (
    networkCalls: StrippedNetworkCall[],
    userId: string
  ) => {
    const promises: Promise<void>[] = []
    let totalUsageDetails: UsageDetails = {
      CO2: 0,
      kWh: 0,
      numberOfCalls: 0,
      numberOfCallsWithoutSize: 0,
      size: 0
    }

    for (const networkCall of networkCalls) {
      const usageDetails = this.getUsageDetailsFromNetworkCall(networkCall)
      totalUsageDetails = this.incrementValues(totalUsageDetails, usageDetails)
      const baseUsageDoc = this.getBaseUsageDoc(usageDetails, userId)
      promises.push(this.storeNetworkCall(baseUsageDoc, networkCall, userId))
    }

    await Promise.all(promises)

    totalUsageDetails.secondsActive = 10
    const baseUsageDoc = this.getBaseUsageDoc(totalUsageDetails, userId)
    await this.updateUserDocs(baseUsageDoc)
  }

  private incrementValues = (
    originalUsage: UsageDetails,
    newUsage: UsageDetails
  ) => {
    const res = { ...originalUsage }
    for (const key of Object.keys(originalUsage)) {
      const number1 = new Big(res[key] || 0)
      const number2 = String(newUsage[key] || 0)
      res[key] = Number(number1.plus(number2))
    }
    return res
  }

  getTotalUsageForUser = async (userId: string, limit: number) => {
    let totalCO2 = 0
    const snapshot = await this.usageCollection
      .where('userId', '==', userId)
      .where('date', '>', limit)
      .get()
    for (const doc of snapshot.docs) {
      const data = doc.data()
      totalCO2 += data.CO2 as number
    }
    return totalCO2
  }

  getAllUsersUsage = async (limit: number) => {
    let totalCO2 = 0
    const usersPerDay: { [date: number]: number } = {}
    const [usageSnapshot, usersActivePerDateSnapshot] = await Promise.all([
      this.totalUsageCollection.where('date', '>', limit).get(),
      this.activeUsersCollection.where('date', '>', limit).get()
    ])
    for (const doc of usersActivePerDateSnapshot.docs) {
      const data = doc.data() as ActiveUserDoc
      usersPerDay[data.date] = data.users?.length
    }
    for (const doc of usageSnapshot.docs) {
      const data = doc.data()
      const CO2 = data.CO2 as number
      const activeUsers = usersPerDay[data.date]
      const average = CO2 / (activeUsers || 1)
      totalCO2 += average
    }
    return totalCO2
  }

  getYesterdaysUsageForUser = async (userId: string) => {
    const yesterday = getDateLimit(1)
    const snapshot = await this.usageCollection
      .doc(`${userId}-${yesterday}`)
      .get()
    if (!snapshot.exists) return 0
    const data = snapshot.data()
    if (!data) return 0
    const yesterdaysPollution = data.CO2
    return yesterdaysPollution
  }
}
