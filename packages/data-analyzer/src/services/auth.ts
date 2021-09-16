import admin from 'firebase-admin'

import firebaseAdmin from './firebase-admin'

export class Auth {
  private client: admin.auth.Auth
  private firebaseAdmin: typeof firebaseAdmin

  constructor(auth: admin.auth.Auth, firebaseAdmin) {
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
  }
}
