import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where
} from 'firebase/firestore'

import { BaseUsageDocResponse, UsageDetails, User } from '@data-collector/types'

import { getDateLimit } from './date'
import { firebase } from './firebase'
import Store from './store'

const firestore = getFirestore(firebase)

export class Firestore {
  private client = firestore
  private store: typeof Store
  private usageCollection: CollectionReference<DocumentData>
  private userCollection: CollectionReference<DocumentData>
  private unsubscribeTodaysListener?: () => void

  constructor(store: typeof Store) {
    this.store = store
    this.usageCollection = collection(this.client, 'usage')
    this.userCollection = collection(this.client, 'users')
  }

  getUserDoc = async (uid: string) => {
    const d = doc(this.userCollection, uid)
    const snapshot = await getDoc(d)
    return snapshot.data() as User
  }

  listenToTodaysUsage = (
    uid: string,
    date: number,
    callback: (usage: UsageDetails) => void
  ) => {
    const d = doc(this.usageCollection, `${uid}-${date}`)
    if (this.unsubscribeTodaysListener) this.unsubscribeTodaysListener()
    this.unsubscribeTodaysListener = onSnapshot(
      d,
      (doc) => {
        const data = doc.data() as any
        const usage: UsageDetails = {
          size: data?.size || 0,
          CO2: data?.CO2 || 0,
          kWh: data?.kWh || 0,
          secondsActive: data?.secondsActive || 0
        }
        callback(usage)
      },
      (error) => {
        console.log(error)
        this.listenToTodaysUsage(uid, date, callback)
      }
    )
  }

  getOwnUsageFromLastWeek = async (uid: string) => {
    const lastWeekLimit = getDateLimit(7)
    const q = query(
      this.usageCollection,
      where('userId', '==', uid),
      where('date', '>', lastWeekLimit)
    )
    const snapshot = await getDocs(q)

    const usage: {
      [date: number]: {
        CO2: number
        kWh: number
        size: number
        numberOfCalls: number
        secondsActive?: number
      }
    } = {}

    for (const doc of snapshot.docs) {
      const data = doc.data() as BaseUsageDocResponse
      usage[data.date] = {
        CO2: data.CO2,
        kWh: data.kWh,
        size: data.size,
        numberOfCalls: data.numberOfCalls,
        secondsActive: data.secondsActive
      }
    }
    return usage
  }
}
