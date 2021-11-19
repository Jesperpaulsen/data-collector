import { initializeApp } from 'firebase/app'
import {
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth'
import admin from 'firebase-admin'

import { SignUp, User } from '@data-collector/types'

import firebaseAdmin from '../src/services/firebase-admin'

const keys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId'
]

const config: { [key: string]: string } = {}

for (const key of keys) {
  config[key] = process.env[`FIREBASE_${key}`] || ''
}

const firebase = initializeApp(config)
const authMock = getAuth(firebase)
connectAuthEmulator(authMock, 'http://localhost:9099')

export const getAdminToken = async () => {
  const testUser = {
    email: 'admin@admin.com',
    name: 'Admin',
    role: 'admin'
  }

  const password = 'admin123'

  const authUser = await firebaseAdmin.auth.createUser({
    email: testUser.email!,
    displayName: testUser.name!,
    password
  })

  const signUp: SignUp = {
    email: testUser.email,
    firstSurveyAnswered: 0,
    firstSurveySent: 0,
    secondSurveyAnswered: 0,
    secondSurveySent: 0,
    showUsage: false
  }

  const signUpDoc = await firebaseAdmin.firestore.addSignUp(signUp)

  const user: User = {
    name: testUser.name!,
    role: 'admin',
    uid: authUser.uid,
    totalCO2: admin.firestore.FieldValue.increment(0),
    totalSize: admin.firestore.FieldValue.increment(0),
    totalkWh: admin.firestore.FieldValue.increment(0),
    numberOfCalls: admin.firestore.FieldValue.increment(0),
    signUpUid: signUpDoc.id
  }

  await firebaseAdmin.firestore.createUser(user)

  await firebaseAdmin.auth.updateUserRole(user.uid, 'admin')
  const res = await signInWithEmailAndPassword(
    authMock,
    testUser.email!,
    password
  )
  return res.user.getIdToken()
}

export const getUserToken = async () => {
  const testUser = {
    email: `test-${Math.random() * 100}@test.com`,
    name: 'Test testesen',
    role: 'user'
  }

  const password = 'test123'

  const authUser = await firebaseAdmin.auth.createUser({
    email: testUser.email!,
    displayName: testUser.name!,
    password
  })

  const signUp: SignUp = {
    email: testUser.email,
    firstSurveyAnswered: 0,
    firstSurveySent: 0,
    secondSurveyAnswered: 0,
    secondSurveySent: 0,
    showUsage: false
  }

  const signUpDoc = await firebaseAdmin.firestore.addSignUp(signUp)

  const user: User = {
    name: testUser.name!,
    role: 'user',
    uid: authUser.uid,
    totalCO2: admin.firestore.FieldValue.increment(0),
    totalSize: admin.firestore.FieldValue.increment(0),
    totalkWh: admin.firestore.FieldValue.increment(0),
    numberOfCalls: admin.firestore.FieldValue.increment(0),
    signUpUid: signUpDoc.id
  }
  await firebaseAdmin.firestore.createUser(user)

  const res = await signInWithEmailAndPassword(
    authMock,
    testUser.email!,
    password
  )

  const token = await res.user.getIdToken()
  return { token, user }
}
