import {
  collection,
  CollectionReference,
  doc,
  DocumentChange,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where
} from 'firebase/firestore'

import { BaseUsageDoc, User } from '@data-collector/types'

import { firebase } from './Firebase'
import { UsageDetails } from '../contexts/Usage/UsageState'

const firestore = getFirestore(firebase)

export class Firestore {
  private client = firestore
  usageCollection: CollectionReference<DocumentData>
  userCollection: CollectionReference<DocumentData>
  private unsubscribeTodaysListener?: () => void

  constructor() {
    this.usageCollection = collection(this.client, 'usage')
    this.userCollection = collection(this.client, 'users')
  }

  getUsageForPreviousDates = async (uid: string, dateLimit: number) => {
    const q = query(
      this.usageCollection,
      where('userId', '==', uid),
      where('date', '>', dateLimit)
    )
    const snapshot = await getDocs(q)
    let usage = 0
    for (const doc of snapshot.docs) {
      const usageDoc = doc.data() as any
      usage += usageDoc.size
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
      console.log(uid)
      this.unsubscribeTodaysListener = onSnapshot(d, (doc) => {
        const data = doc.data() as any
        const usage = { size: data.size, CO2: data.CO2, KWH: data.KWH }
        callback(usage)
      })
    } catch (e) {
      console.log(e)
    }
  }
}

export default new Firestore()
