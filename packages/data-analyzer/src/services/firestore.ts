import admin from 'firebase-admin'

import { User } from '@data-collector/types'

import FirebaseAdmin from './firebase-admin'
import { NetworkCallController } from './network-call-controller'

export class Firestore {
  client: admin.firestore.Firestore
  private firebaseAdmin: typeof FirebaseAdmin
  private userCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  networkCallController: NetworkCallController

  constructor(
    firestore: admin.firestore.Firestore,
    firebaseAdmin: typeof FirebaseAdmin
  ) {
    this.client = firestore
    this.firebaseAdmin = firebaseAdmin
    this.userCollection = this.client.collection('users')
    this.networkCallController = new NetworkCallController(
      this,
      this.client.collection('hosts'),
      this.client.collection('countries'),
      this.client.collection('usage'),
      this.client.collection('hostToCountry'),
      this.client.collection('totalUsage')
    )
  }

  getAllUsers = () => {
    return this.userCollection.get()
  }

  getUser = async (userId: string) => {
    const snapshot = await this.userCollection.doc(userId).get()
    return snapshot.data() as User
  }

  checkIfUserExists = async (uid: string) => {
    const snapshot = await this.getUser(uid)
    return !!snapshot
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
}
