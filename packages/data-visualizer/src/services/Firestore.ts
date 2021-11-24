import {
  collection,
  CollectionReference,
  connectFirestoreEmulator,
  doc,
  DocumentChange,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore'

import User from '../types/User'
import { BaseUsageDocResponse } from '../types/base-usage-doc'
import { firebase } from './Firebase'
import { UsageDetails } from '../contexts/Usage/UsageState'
import { CountryDoc } from '../types/country-doc'
import { accUsageDetails } from '../utils/accUsageDetails'

const firestore = getFirestore(firebase)
// @ts-ignore
if (import.meta.env.EMULATOR)
  connectFirestoreEmulator(firestore, 'localhost', 8080)

export class Firestore {
  private client = firestore
  usageCollection: CollectionReference<DocumentData>
  countryCollection: CollectionReference<DocumentData>
  userCollection: CollectionReference<DocumentData>
  hostCollection: CollectionReference<DocumentData>
  hostToCountryCollection: CollectionReference<DocumentData>
  totalUsageCollection: CollectionReference<DocumentData>

  private unsubscribeTodaysListener?: () => void

  constructor() {
    this.usageCollection = collection(this.client, 'usage')
    this.countryCollection = collection(this.client, 'countries')
    this.userCollection = collection(this.client, 'users')
    this.hostCollection = collection(this.client, 'hosts')
    this.hostToCountryCollection = collection(this.client, 'hostToCountry')
    this.totalUsageCollection = collection(this.client, 'totalUsage')
  }

  getUsageForPreviousDates = async (uid: string, dateLimit: number) => {
    const q = query(
      this.usageCollection,
      where('userId', '==', uid),
      where('date', '>', dateLimit)
    )
    const snapshot = await getDocs(q)

    const usage: {
      [date: number]: {
        CO2: number
        kWh: number
        size: number
        numberOfCalls: number
      }
    } = {}

    for (const doc of snapshot.docs) {
      const data = doc.data() as BaseUsageDocResponse
      usage[data.date] = {
        CO2: data.CO2,
        kWh: data.kWh,
        size: data.size,
        numberOfCalls: data.numberOfCalls
      }
    }
    return usage
  }

  getUserDoc = async (uid: string) => {
    const d = doc(this.userCollection, uid)
    const snapshot = await getDoc(d)
    return snapshot.data() as User
  }

  listenToTodaysUsage = (
    uid: string,
    date: number,
    callback: (props: UsageDetails) => void
  ) => {
    try {
      const d = doc(this.usageCollection, `${uid}-${date}`)
      if (this.unsubscribeTodaysListener) this.unsubscribeTodaysListener()
      this.unsubscribeTodaysListener = onSnapshot(d, (doc) => {
        const data = doc.data() as any
        const usage = {
          size: data?.size || 0,
          CO2: data?.CO2 || 0,
          kWh: data?.kWh || 0,
          numberOfCalls: data?.numberOfCalls || 0,
          numberOfCallsWithoutSize: data?.numberOfCallsWithoutSize || 0
        }
        callback(usage)
      })
    } catch (e) {
      console.log(e)
    }
  }

  getUsageByCountryForUser = async (userId: string) => {
    const q = query(this.countryCollection, where('userId', '==', userId))
    return getDocs(q)
  }

  getUsageByHostForUser = async (userId: string) => {
    const q = query(
      this.hostCollection,
      where('userId', '==', userId),
      orderBy('hostOrigin', 'asc')
    )
    return getDocs(q)
  }

  getCountryUsagePerHost = async (userId: string, countryCode: string) => {
    const q = query(
      this.hostToCountryCollection,
      where('userId', '==', userId),
      where('countryCode', '==', countryCode),
      orderBy('CO2', 'desc')
    )
    return getDocs(q)
  }

  getCountryForHost = async (userId: string, host: string) => {
    const q = query(
      this.hostToCountryCollection,
      where('userId', '==', userId),
      where('hostOrigin', '==', host)
    )
    return getDocs(q)
  }
}

export default new Firestore()
