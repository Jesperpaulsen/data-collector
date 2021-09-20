import admin from 'firebase-admin'

import { NetworkCall, User } from '@data-collector/types'

import FirebaseAdmin from './firebase-admin'

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

  createNetworkCall = async (networkCall: NetworkCall) => {
    const reference = this.networkCallCollection.doc()
    const networkCallToAdd = { ...networkCall, uid: reference.id }
    await reference.set(networkCallToAdd)
    return reference.id
  }

  updateNetworkCall = async (
    uid: string,
    networkCall: Partial<NetworkCall>
  ) => {
    return this.networkCallCollection.doc(uid).update(networkCall)
  }
}
