import admin from 'firebase-admin'

const serviceAccount = require('../../serviceAccount.json')

class FirebaseAdmin {
  admin: {
    auth: admin.auth.Auth
    firestore: admin.firestore.Firestore
  }

  constructor() {
    const options: admin.AppOptions = {
      projectId: 'data-collector-ff33b',
      credential: admin.credential.cert(serviceAccount)
    }

    if (process.env.test) {
      this.setUpEmulatorPorts()
    }

    const initializedAdmin = admin.initializeApp(options)
    this.admin = {
      auth: initializedAdmin.auth(),
      firestore: initializedAdmin.firestore()
    }
  }

  private setUpEmulatorPorts = () => {
    process.env.FIRESTORE_EMULATOR_HOST="localhost:8080"
    process.env.FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"
  }
}

export default new FirebaseAdmin()
