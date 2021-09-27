import admin from 'firebase-admin'

import { NetworkCall, NetworkCallDoc, User } from '@data-collector/types'

import Country from './country'
import FirebaseAdmin from './firebase-admin'
import Whois from './whois'

export class Firestore {
  private client: admin.firestore.Firestore
  private firebaseAdmin: typeof FirebaseAdmin
  private userCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  private networkCallCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>

  constructor(
    firestore: admin.firestore.Firestore,
    firebaseAdmin: typeof FirebaseAdmin
  ) {
    this.client = firestore
    this.firebaseAdmin = firebaseAdmin
    this.userCollection = this.client.collection('users')
    this.networkCallCollection = this.client.collection('networkCall')
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

  getAllNetworkCalls = () => {
    return this.networkCallCollection.get()
  }

  getNetworkCall = async (uid: string) => {
    const snapshot = await this.networkCallCollection.doc(uid).get()
    return snapshot.data() as NetworkCall
  }

  getNetworkCallsForUser = async (uid: string) => {
    const networkCalls = await this.networkCallCollection
      .where('userId', '==', uid)
      .get()

    const res: NetworkCall[] = []

    for (const doc of networkCalls.docs) {
      res.push(doc.data() as NetworkCall)
    }

    return res
  }

  createNetworkCall = async (networkCall: NetworkCall) => {
    const reference = this.networkCallCollection.doc()
    const {
      hostOrigin,
      hostPathname,
      timestamp,
      type,
      manuallyCalculated,
      size,
      targetOrigin,
      targetPathname,
      targetIP,
      userId
    } = networkCall

    const targetCountry = Country.getCountry(targetIP)
    const networkCallDoc: NetworkCallDoc = {
      hostOrigin,
      hostPathname,
      timestamp,
      type,
      targetIP: targetIP || null,
      targetCountry: targetCountry || null,
      uid: reference.id,
      manuallyCalculated: !!manuallyCalculated,
      size: size || null,
      targetOrigin: targetOrigin || null,
      targetPathname: targetPathname || null,
      userId: userId!
    }

    await reference.set(networkCallDoc)
    return reference.id
  }

  updateNetworkCall = async (
    uid: string,
    networkCall: Partial<NetworkCall>
  ) => {
    return this.networkCallCollection.doc(uid).update(networkCall)
  }
}
