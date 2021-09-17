import admin from 'firebase-admin'

import FirebaseAdmin from './firebase-admin'

export class Auth {
  private client: admin.auth.Auth
  private firebaseAdmin: typeof FirebaseAdmin

  constructor(auth: admin.auth.Auth, firebaseAdmin: typeof FirebaseAdmin) {
    this.client = auth
    this.firebaseAdmin = firebaseAdmin
  }

  createUser = async ({
    displayName,
    email,
    password
  }: {
    displayName: string
    email: string
    password: string
  }) => {
    return this.client.createUser({
      displayName,
      email,
      password
    })
  }

  listUsers = () => {
    return this.client.listUsers()
  }

  updateUserRole = async (uid: string, role: 'admin' | 'user') => {
    await this.client.setCustomUserClaims(uid, { role })
    await this.firebaseAdmin.firestore.updateUser(uid, { role })
  }
}
