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

import { firebase } from './firebase'
import Store from './store'

const firestore = getFirestore(firebase)

export class Firestore {
  private client = firestore
  private store: typeof Store
  private usageCollection: CollectionReference<DocumentData>
  private userCollection: CollectionReference<DocumentData>

  constructor(store: typeof Store) {
    this.store = store
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
      const usageDoc = doc.data() as BaseUsageDoc
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
    callback: (usage: number) => void
  ) => {
    const d = doc(this.usageCollection, `${uid}-${date}`)
    console.log(date)
    onSnapshot(d, (doc) => {
      const data = doc.data() as BaseUsageDoc
      callback(data.size)
    })
  }
}
