import admin from 'firebase-admin'

import { Auth } from './auth'
import { Firestore } from './firestore'

const serviceAccount = require('../../serviceAccount.json')

const getAdminObject = (initializedAdmin: admin.app.App) => {
  return {
    ...admin,
    auth: new Auth(initializedAdmin.auth()),
    firestore: new Firestore(initializedAdmin.firestore())
  }
}

class FirebaseAdmin {
  admin: ReturnType<typeof getAdminObject>

  constructor() {
    const options: admin.AppOptions = {
      projectId: 'data-collector-ff33b',
      credential: admin.credential.cert(serviceAccount)
    }
    const initializedAdmin = admin.initializeApp(options)
    this.admin = getAdminObject(initializedAdmin)
  }
}

export default new FirebaseAdmin()
