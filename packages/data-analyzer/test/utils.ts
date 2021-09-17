import { initializeApp } from 'firebase/app'
import {
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth'

import { User } from '@data-collector/types'

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
  if (!process.env) break
  config[key] = process.env[`FIREBASE_${key}`] || ''
}

const firebase = initializeApp(config)
const authMock = getAuth(firebase)
connectAuthEmulator(authMock, 'http://localhost:9099')

export const getAdminToken = async () => {
  const testUser: Partial<User> = {
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

  const user: User = {
    email: testUser.email!,
    name: testUser.name!,
    role: testUser.role!,
    uid: authUser.uid
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
