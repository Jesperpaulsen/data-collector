import admin from 'firebase-admin'

import {
  CountryDoc,
  HostDoc,
  NetworkCall,
  NetworkCallDoc,
  User
} from '@data-collector/types'

import Country from './country'
import FirebaseAdmin from './firebase-admin'

export class Firestore {
  private client: admin.firestore.Firestore
  private firebaseAdmin: typeof FirebaseAdmin
  private userCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  private hostCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  private countryCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>

  constructor(
    firestore: admin.firestore.Firestore,
    firebaseAdmin: typeof FirebaseAdmin
  ) {
    this.client = firestore
    this.firebaseAdmin = firebaseAdmin
    this.userCollection = this.client.collection('users')
    this.hostCollection = this.client.collection('hosts')
    this.countryCollection = this.client.collection('countries')
  }

  getAllUsers = () => {
    return this.userCollection.get()
  }

  getUser = async (userId: string) => {
    const snapshot = await this.userCollection.doc(userId).get()
    return snapshot.data() as User
  }

  createUser = async (user: User) => {
    return this.userCollection.doc(user.uid).set(user)
  }

  updateUser = async (uid: string, user: Partial<User>) => {
    return this.userCollection.doc(uid).update(user)
  }

  deleteUser = (uid: string) => {
    return this.userCollection.doc(uid).delete()
  }

  getDateString = () => {
    return new Date().toISOString().split('T')[0]
  }

  getAllNetworkCalls = async () => {
    const promises = [this.hostCollection.get(), this.countryCollection.get()]
    const [hostDocs, countryDocs] = await Promise.all(promises)
    return [...hostDocs.docs, ...countryDocs.docs]
  }

  getNetworkCall = async (type: 'country' | 'host', uid: string) => {
    const collection =
      type === 'country' ? this.countryCollection : this.hostCollection
    const snapshot = await collection.doc(uid).get()
    return snapshot.data() as NetworkCallDoc
  }

  getNetworkCallsForUser = async (uid: string) => {
    const promises = [
      this.hostCollection.where('userId', '==', uid).get(),
      this.countryCollection.where('userId', '==', uid).get()
    ]
    const [hostCollection, countryCollection] = await Promise.all(promises)

    const res: NetworkCall[] = []

    const networkCalls = [...hostCollection.docs, ...countryCollection.docs]

    for (const doc of networkCalls) {
      res.push(doc.data() as NetworkCall)
    }

    return res
  }

  getDocId = (identifier: string, userId: string) => {
    if (!identifier) return null
    const date = this.getDateString()
    return `${userId}-${identifier}-${date}`
  }

  createCountryDoc = async (networkCall: NetworkCallDoc) => {
    const { country, numberOfCallsWithoutSize, size, userId, CO2 } = networkCall
    const uid = this.getDocId(country, userId)

    if (!uid) {
      console.error(`Missing country for doc`)
      return
    }

    const date = this.getDateString()
    const countryDoc: CountryDoc = {
      uid,
      userId,
      date,
      numberOfCallsWithoutSize,
      size,
      CO2
    }
    await this.countryCollection.doc(uid).set(countryDoc, { merge: true })
    return uid
  }

  createHostDoc = async (networkCall: NetworkCallDoc) => {
    const { hostOrigin, numberOfCallsWithoutSize, size, userId, CO2 } =
      networkCall
    const uid = this.getDocId(hostOrigin, userId)

    if (!uid) {
      console.error(`Missing country for doc`)
      return
    }

    const date = this.getDateString()
    const hostDoc: HostDoc = {
      uid,
      userId,
      date,
      hostOrigin,
      numberOfCallsWithoutSize,
      size,
      CO2
    }
    await this.hostCollection.doc(uid).set(hostDoc, { merge: true })
    return uid
  }

  updateUserStats = async (networkCall: NetworkCallDoc) => {
    const fieldsToUpdate: Pick<User, 'totalCO2' | 'totalSize'> = {
      totalSize: admin.firestore.FieldValue.increment(networkCall.size),
      totalCO2: admin.firestore.FieldValue.increment(networkCall.CO2)
    }
    await this.userCollection.doc(networkCall.userId).update(fieldsToUpdate)
    return networkCall.userId
  }

  storeNetworkCall = async (networkCall: NetworkCall, userId: string) => {
    const { hostOrigin, size, targetIP } = networkCall

    const targetCountry = Country.getCountry(targetIP)
    const CO2 = Country.calculateEmission(targetCountry)

    const networkCallDoc: NetworkCallDoc = {
      hostOrigin,
      country: targetCountry || '',
      userId,
      numberOfCallsWithoutSize: admin.firestore.FieldValue.increment(
        size ? 0 : 1
      ),
      size: admin.firestore.FieldValue.increment(size || 0),
      CO2: admin.firestore.FieldValue.increment(CO2 || 0),
      date: this.getDateString()
    }

    const promises = [
      this.createHostDoc(networkCallDoc),
      this.createCountryDoc(networkCallDoc),
      this.updateUserStats(networkCallDoc)
    ]

    const [host, network] = await Promise.all(promises)
    return { host, network }
  }
}
