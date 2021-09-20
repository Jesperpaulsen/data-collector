import admin from 'firebase-admin'

import { Auth } from './auth'
import { Firestore } from './firestore'

let serviceAccount
try {
  serviceAccount = require('../../serviceAccount.json')
} catch (e) {
  const key = process.env.FB_SA_KEY
  if (!key)
    throw Error(
      'Make sure the FB_SA_KEY or the service account is available to firebase'
    )
  const buffer = Buffer.from(key, 'base64')
  serviceAccount = JSON.parse(buffer.toString())
}
class FirebaseAdmin {
  admin: admin.app.App
  auth: Auth
  firestore: Firestore

  constructor() {
    const options: admin.AppOptions = {
      projectId: 'data-collector-ff33b',
      credential: serviceAccount
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault()
    }
    const initializedAdmin = admin.initializeApp(options)
    this.admin = initializedAdmin
    this.auth = new Auth(initializedAdmin.auth(), this)
    this.firestore = new Firestore(initializedAdmin.firestore(), this)
  }
}

export default new FirebaseAdmin()
