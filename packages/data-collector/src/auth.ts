import {
  browserLocalPersistence,
  GoogleAuthProvider,
  indexedDBLocalPersistence,
  initializeAuth,
  inMemoryPersistence,
  signInWithCredential
} from 'firebase/auth'

import api from './api'
import { firebase } from './firebase'

const auth = initializeAuth(firebase, {
  persistence:
    typeof window === 'undefined'
      ? inMemoryPersistence
      : [indexedDBLocalPersistence, browserLocalPersistence]
})

class Auth {
  private client = auth
  private provider = new GoogleAuthProvider()

  constructor() {
    this.signIn()
  }

  private fetchAuthToken = async ({
    interactive
  }: {
    interactive: boolean
  }): Promise<string> => {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive }, (token) => {
        if (!token) reject(new Error('No token provided'))
        resolve(token)
      })
    })
  }

  signIn = async () => {
    const token = await this.forceLogin()
    await this.signInWithGoogle(token)
  }

  forceLogin = async () => {
    let token: string
    try {
      token = await this.fetchAuthToken({ interactive: false })
    } catch (e) {
      token = await this.fetchAuthToken({ interactive: true })
    }
    return token
  }

  private signInWithGoogle = async (token: string) => {
    const credential = GoogleAuthProvider.credential(null, token)
    const res = await signInWithCredential(this.client, credential)
    let displayName = res.user.displayName
    console.log(res.user.providerData)
    if (!displayName && res.user.providerData?.length) {
      displayName = res.user.providerData[0].displayName
    }
    api.setUser(res.user)
    api.createUser({
      email: res.user.email || '',
      name: displayName || '',
      uid: res.user.uid
    })
  }
}

export default new Auth()
