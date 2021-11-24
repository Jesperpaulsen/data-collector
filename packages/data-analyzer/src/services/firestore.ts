import admin from 'firebase-admin'

import { ActiveUserDoc, SignUp, User } from '@data-collector/types'

import { getStartOfDateInUnix } from '../utils/date'

import FirebaseAdmin from './firebase-admin'
import { NetworkCallController } from './network-call-controller'

export class Firestore {
  client: admin.firestore.Firestore
  private firebaseAdmin: typeof FirebaseAdmin
  private userCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  private signUpCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  private activeUsersCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  networkCallController: NetworkCallController

  constructor(
    firestore: admin.firestore.Firestore,
    firebaseAdmin: typeof FirebaseAdmin
  ) {
    this.client = firestore
    this.firebaseAdmin = firebaseAdmin
    this.userCollection = this.client.collection('users')
    this.signUpCollection = this.client.collection('signUps')
    this.activeUsersCollection = this.client.collection('activeUsers')
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

  addSignUp = async (signUp: SignUp) => {
    const snapshot = await this.signUpCollection
      .where('email', '==', signUp.email)
      .get()
    if (snapshot.docs.length > 0) {
      throw new Error('Email already signed up')
    }
    return this.signUpCollection.add(signUp)
  }

  getActiveUsersAfterLimit = async (limit: number) => {
    const res: { [date: number]: number } = {}

    const snapshot = await this.activeUsersCollection
      .where('date', '>', limit)
      .get()

    for (const doc of snapshot.docs) {
      const data = doc.data() as ActiveUserDoc
      res[data.date] = data.users.length
    }
    return res
  }

  addActiveUser = async (uid: string) => {
    const startOfToday = getStartOfDateInUnix(new Date())

    const docRef = this.activeUsersCollection.doc(String(startOfToday))

    await docRef.set(
      {
        users: admin.firestore.FieldValue.arrayUnion(uid),
        date: startOfToday
      },
      { merge: true }
    )
  }

  findSignUp = async (email: string) => {
    const snapshot = await this.signUpCollection
      .where('email', '==', email)
      .get()
    if (!snapshot.docs.length) {
      return ''
    }
    return snapshot.docs[0].id
  }

  getAllSignUps = async () => {
    const snapshot = await this.signUpCollection.get()
    const res: SignUp[] = []
    for (const doc of snapshot.docs) {
      const signUp = doc.data() as SignUp
      res.push({ ...signUp, signUpId: doc.id })
    }
    return res
  }

  getSignUpsForFirstSurvey = async () => {
    const snapshot = await this.signUpCollection
      .where('firstSurveySent', '==', 0)
      .get()
    const res: SignUp[] = []
    for (const doc of snapshot.docs) {
      const signUp = doc.data() as SignUp
      res.push({ ...signUp, signUpId: doc.id })
    }
    return res
  }

  updateSignUp = (signUpUid: string, signUp: SignUp) => {
    return this.signUpCollection.doc(signUpUid).set(signUp, { merge: true })
  }

  updateUserHaveBeenActive = (userId: string, seconds: number) => {
    if (!userId || !seconds) return
    const secondsActive = admin.firestore.FieldValue.increment(seconds)
    const date = getStartOfDateInUnix(new Date())
    const usageId = this.networkCallController.getDocId({
      userId: userId,
      date: date
    })
    return Promise.all([
      this.userCollection.doc(userId).set({ secondsActive }, { merge: true }),
      this.networkCallController.usageCollection
        .doc(usageId)
        .set({ secondsActive }, { merge: true })
    ])
  }
}
