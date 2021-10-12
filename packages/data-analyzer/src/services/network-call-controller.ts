import {
  BaseUsageDoc,
  CountryDoc,
  HostDoc,
  HostToCountry,
  NetworkCall,
  User
} from '@data-collector/types'
import admin from 'firebase-admin'
import Country from './country'
import { getStartOfDateInUnix } from '../utils/date'
import { USAGE_TYPES } from '../types/USAGE_TYPES'
import { Firestore } from './firestore'

type CollectionType =
  admin.firestore.CollectionReference<admin.firestore.DocumentData>
export class NetworkCallController {
  private hostCollection: CollectionType
  private countryCollection: CollectionType
  private usageCollection: CollectionType
  private hostToCountryCollection: CollectionType
  private totalUsageCollection: CollectionType
  private firestore: Firestore

  constructor(
    firestore: Firestore,
    hostCollection: CollectionType,
    countryCollection: CollectionType,
    usageCollection: CollectionType,
    hostToCountryCollection: CollectionType,
    totalUsageCollection: CollectionType
  ) {
    this.firestore = firestore
    this.hostCollection = hostCollection
    this.countryCollection = countryCollection
    this.usageCollection = usageCollection
    this.hostToCountryCollection = hostToCountryCollection
    this.totalUsageCollection = usageCollection
  }

  getAllNetworkCalls = async () => {
    const promises = [
      this.hostCollection.get(),
      this.countryCollection.get(),
      this.usageCollection.get()
    ]
    const [hostDocs, countryDocs, usageDocs] = await Promise.all(promises)
    return [...hostDocs.docs, ...countryDocs.docs, ...usageDocs.docs]
  }

  getCollection = (type: USAGE_TYPES) => {
    return type === USAGE_TYPES.COUNTRY
      ? this.countryCollection
      : this.hostCollection
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

    const res: BaseUsageDoc[] = []

    const networkCalls = [
      ...hostCollection.docs,
      ...countryCollection.docs,
      ...usageCollection.docs,
      ...hostToCountryCollection.docs
    ]

    for (const doc of networkCalls) {
      res.push(doc.data() as BaseUsageDoc)
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
    return identifier?.length && date && userId
      ? `${userId}-${identifier}-${date}`
      : identifier && userId
      ? `${userId}-${identifier}`
      : userId
      ? `${userId}-${date}`
      : String(date)
  }

  private getFieldValue = (numberOfIncrements: number) => {
    return admin.firestore.FieldValue.increment(numberOfIncrements)
  }

  updateUserStats = async (networkCall: BaseUsageDoc) => {
    const fieldsToUpdate: Pick<
      User,
      'totalCO2' | 'totalSize' | 'totalKWH' | 'numberOfCalls'
    > = {
      totalSize: networkCall.size,
      totalCO2: networkCall.CO2,
      totalKWH: networkCall.KWH,
      numberOfCalls: networkCall.numberOfCalls
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
    delete networkCall.date

    const hostToCountryDoc: HostToCountry = {
      ...networkCall,
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
    // @ts-ignore
    delete networkCall.userId
    return this.totalUsageCollection.doc(uid).set(networkCall, { merge: true })
  }

  private getHostName = (url: string) => {
    if (!url) return ''
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
  }

  storeNetworkCall = async (networkCall: NetworkCall, userId: string) => {
    const { hostOrigin, size, targetIP } = networkCall

    const date = getStartOfDateInUnix(new Date())
    const { countryCode, countryName } = Country.getCountry(targetIP)
    const { CO2, KWH } = Country.calculateEmission({ size, countryCode })
    const usageId = this.getDocId({ userId, date })
    const strippedHostOrigin = this.getHostName(hostOrigin)

    const baseUsageDoc: BaseUsageDoc = {
      uid: usageId,
      CO2: this.getFieldValue(CO2),
      KWH: this.getFieldValue(KWH),
      date,
      numberOfCalls: this.getFieldValue(1),
      numberOfCallsWithoutSize: this.getFieldValue(size ? 0 : 1),
      size: this.getFieldValue(size || 0),
      userId,
      type: USAGE_TYPES.USAGE
    }

    const promises = [
      this.updateUserStats(baseUsageDoc),
      this.setHostDoc(baseUsageDoc, strippedHostOrigin, usageId),
      this.setCountryDoc(baseUsageDoc, countryCode, countryName, usageId),
      this.setUsageDoc(baseUsageDoc),
      this.updateTotalUsage(baseUsageDoc)
    ]

    if (strippedHostOrigin.length && countryCode)
      promises.push(
        this.setHostToCountryDoc(
          baseUsageDoc,
          countryCode,
          countryName,
          strippedHostOrigin
        )
      )

    try {
      const [host, network, country, usage, totalUsage, hostToCountry] =
        await Promise.all(promises)
      return { host, network, country, usage, totalUsage, hostToCountry }
    } catch (e) {
      console.log(e)
    }
  }
}
