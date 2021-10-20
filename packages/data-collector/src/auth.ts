import {
  browserLocalPersistence,
  GoogleAuthProvider,
  indexedDBLocalPersistence,
  initializeAuth,
  inMemoryPersistence,
  OAuthCredential,
  signInWithCredential
} from 'firebase/auth'

import { MESSAGE_TYPES } from '@data-collector/types'

import { firebase } from './firebase'
import Store from './store'

const auth = initializeAuth(firebase, {
  persistence:
    typeof window === 'undefined'
      ? inMemoryPersistence
      : [indexedDBLocalPersistence, browserLocalPersistence]
})

export class Auth {
  private client = auth
  private store: typeof Store
  private credentials?: OAuthCredential

  constructor(store: typeof Store) {
    this.store = store
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
    await this.client.signOut()
    const token = await this.forceLogin()
    console.log('token' + token)
    await this.signInWithGoogle(token)
    if (this.store.user) {
      await this.store.api.reportUserActive()
      await this.store.usageCounter.listenToChanges()
    }
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

  getToken = () => {
    return this.forceLogin()
  }

  sendCredentials = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.SEND_CREDENTIALS,
      payload: this.credentials
    })
  }

  private signInWithGoogle = async (token: string) => {
    this.credentials = GoogleAuthProvider.credential(null, token)
    const res = await signInWithCredential(this.client, this.credentials)
    let displayName = res.user.displayName || ''
    if (!displayName && res.user.providerData?.length) {
      displayName = res.user.providerData[0].displayName?.split(' ')[0] || ''
    }
    // @ts-ignore
    res.user.displayName = displayName
    this.store.setUser(res.user)
    this.store.api.createUser({
      email: res.user.email || '',
      name: displayName || '',
      uid: res.user.uid
    })
  }
}
