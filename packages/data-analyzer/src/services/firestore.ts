import admin from 'firebase-admin'

import { User } from '@data-collector/types'

import FirebaseAdmin from './firebase-admin'

export class Firestore {
  private client: admin.firestore.Firestore
  private firebaseAdmin: typeof FirebaseAdmin
  private userCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>

  constructor(
    firestore: admin.firestore.Firestore,
    firebaseAdmin: typeof FirebaseAdmin
  ) {
    this.client = firestore
    this.firebaseAdmin = firebaseAdmin
    this.userCollection = this.client.collection('users')
  }

  getAllUsers = () => {
    return this.userCollection.get()
  }

  getUser = async (userId: string) => {
    const snapshot = await this.userCollection.doc(userId).get()
    return snapshot.data()
  }

  createUser = async (user: User) => {
    return this.userCollection.doc(user.uid).set(user)
  }

  updateUser = async (uid: User['uid'], user: Partial<User>) => {
    return this.userCollection.doc(uid).update(user)
  }
}
