import admin from 'firebase-admin'

import { User } from '@data-collector/types'

export class Firestore {
  private client: admin.firestore.Firestore
  private userCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>

  constructor(firestore: admin.firestore.Firestore) {
    this.client = firestore
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
}
