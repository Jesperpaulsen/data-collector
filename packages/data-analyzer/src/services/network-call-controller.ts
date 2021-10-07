import {
  BaseUsageDoc,
  CountryDoc,
  HostDoc,
  NetworkCall,
  User
} from '@data-collector/types'
import admin from 'firebase-admin'
import Country from './country'
import { getStartOfDateInUnix } from '../utils/date'
import { USAGE_TYPES } from '../types/USAGE_TYPES'
import { Firestore } from './firestore'

export class NetworkCallController {
  private hostCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  private countryCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  private usageCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  private firestore: Firestore

  constructor(
    firestore: Firestore,
    hostCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>,
    countryCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>,
    usageCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  ) {
    this.firestore = firestore
    this.hostCollection = hostCollection
    this.countryCollection = countryCollection
    this.usageCollection = usageCollection
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
      this.usageCollection.where('userId', '==', uid).get()
    ]
    const [hostCollection, countryCollection, usageCollection] =
      await Promise.all(promises)

    const res: BaseUsageDoc[] = []

    const networkCalls = [
      ...hostCollection.docs,
      ...countryCollection.docs,
      ...usageCollection.docs
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
    userId: string
    date: number
  }) => {
    return identifier?.length
      ? `${userId}-${identifier}-${date}`
      : `${userId}-${date}`
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
    const paths = hostOrigin.split('://')
    let identifier = paths.length > 1 ? paths[1] : ''
    if (identifier.startsWith('www')) {
      identifier = identifier.substr(3)
    }
    const uid = this.getDocId({
      identifier,
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

  storeNetworkCall = async (networkCall: NetworkCall, userId: string) => {
    const { hostOrigin, size, targetIP } = networkCall

    const date = getStartOfDateInUnix(new Date())
    const { countryCode, countryName } = Country.getCountry(targetIP)
    const { CO2, KWH } = Country.calculateEmission({ size, countryCode })
    const usageId = this.getDocId({ userId, date })
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
      this.setHostDoc(baseUsageDoc, hostOrigin || '', usageId),
      this.setCountryDoc(baseUsageDoc, countryCode, countryName, usageId),
      this.setUsageDoc(baseUsageDoc)
    ]
    try {
      const [host, network, country, usage] = await Promise.all(promises)
      return { host, network, country, usage }
    } catch (e) {
      console.log(e)
    }
  }
}
