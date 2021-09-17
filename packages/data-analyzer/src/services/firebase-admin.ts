import admin from 'firebase-admin'

import { Auth } from './auth'
import { Firestore } from './firestore'

const serviceAccount = require('../../serviceAccount.json')

class FirebaseAdmin {
  admin: admin.app.App
  auth: Auth
  firestore: Firestore

  constructor() {
    const options: admin.AppOptions = {
      projectId: 'data-collector-ff33b',
      credential: admin.credential.cert(serviceAccount)
    }
    const initializedAdmin = admin.initializeApp(options)
    this.admin = initializedAdmin
    this.auth = new Auth(initializedAdmin.auth(), this)
    this.firestore = new Firestore(initializedAdmin.firestore(), this)
  }
}

export default new FirebaseAdmin()
