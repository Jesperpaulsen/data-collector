import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDoc,
  getFirestore,
  onSnapshot
} from 'firebase/firestore'

import { UsageDetails, User } from '@data-collector/types'

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
    this.unsubscribeTodaysListener = onSnapshot(d, (doc) => {
      const data = doc.data() as any
      const usage: UsageDetails = {
        size: data.size,
        CO2: data.CO2,
        KWH: data.KWH
      }
      callback(usage)
    })
  }
}
