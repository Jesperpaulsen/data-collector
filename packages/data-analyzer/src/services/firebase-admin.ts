import admin from 'firebase-admin'

import { Auth } from './auth'
import { Firestore } from './firestore'

/* let serviceAccount
try {
  serviceAccount = require('../../serviceAccount.json')
} catch (e) {
  console.log(e)
} */

class FirebaseAdmin {
  admin: admin.app.App
  auth: Auth
  firestore: Firestore

  constructor() {
    const options: admin.AppOptions = {
      projectId: 'data-collector-ff33b',
      /* credential: serviceAccount
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault() */
      credential: admin.credential.applicationDefault()
    }
    const initializedAdmin = admin.initializeApp(options)
    this.admin = initializedAdmin
    this.auth = new Auth(initializedAdmin.auth(), this)
    this.firestore = new Firestore(initializedAdmin.firestore(), this)
  }
}

export default new FirebaseAdmin()
