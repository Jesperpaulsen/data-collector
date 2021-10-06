import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  UserCredential,
  onAuthStateChanged
} from 'firebase/auth'

import { isMobile } from '../../utils/isMobile'

import { firebase } from '../../services/Firebase'
import { GenericHandler } from '../../types/GenericHandler'
import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES'
import { UserApi } from './UserApi'

import { UserState } from './UserState'
import { User } from '@data-collector/types'

const auth = getAuth(firebase)

const extensionId = 'jkoeemadehedckholhdkcjnadckenjgd'

const provider = new GoogleAuthProvider()
provider.addScope('https://www.googleapis.com/auth/userinfo.email')
provider.addScope('https://www.googleapis.com/auth/userinfo.profile')

export class UserHandler extends GenericHandler<UserState> {
  client = auth
  private api: UserApi

  constructor(
    initialState: UserState,
    updateState: (newState: UserState) => void
  ) {
    super(initialState, updateState)
    this.api = new UserApi(this)
    this.listenToAuthChanges()
    this.setUp()
  }

  private listenToAuthChanges = () => {
    onAuthStateChanged(this.client, async (authState) => {
      const user = await this.api.getUser(authState?.uid)
      this.setState({ currentUser: user })
    })
  }

  private setUp = async () => {
    try {
      const redirectResult = await this.checkIfRedirect()
      if (redirectResult) {
        this.parseSignInResult(redirectResult)
      }
      const isAvailable = await this.checkIfExtensionIsAvailable()
      this.setState({ extensionInstalled: isAvailable })
      if (isAvailable) {
        const token = await this.requestToken()
        if (token) {
          await this.signInWithExtension(token)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  getUserToken = async () => {
    const token = await this.client.currentUser?.getIdToken()
    return token || ''
  }

  private checkIfExtensionIsAvailable = (): Promise<boolean> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        extensionId,
        { type: MESSAGE_TYPES.REQUEST_CONFIRMATION },
        (details) => {
          resolve(details)
        }
      )
    })
  }

  requestToken = (): Promise<string> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        extensionId,
        { type: MESSAGE_TYPES.REQUEST_CREDENTIALS },
        (response) => {
          resolve(response)
        }
      )
    })
  }

  signInWithExtension = async (token: string) => {
    const credentials = GoogleAuthProvider.credential(null, token)
    await signInWithCredential(this.client, credentials)
    if (this.client.currentUser) {
      const user = await this.api.getUser(this.client.currentUser?.uid)
      this.setState({ currentUser: user })
    }
  }

  private checkIfRedirect = async () => {
    try {
      const result = await getRedirectResult(auth)
      return result
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.email
      const credential = GoogleAuthProvider.credentialFromError(error)
    }
  }

  signIn = async () => {
    if (this.state.extensionInstalled) {
      const token = await this.requestToken()
      if (token) {
        this.signInWithExtension(token)
        return
      }
    }
    this.signInWithGoogle()
  }

  private signInWithGoogle = async () => {
    if (isMobile()) {
      this.signInWithRedirect()
    } else {
      this.signInWithPopup()
    }
  }

  private signInWithRedirect = async () => {
    signInWithRedirect(this.client, provider)
  }

  private signInWithPopup = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      this.parseSignInResult(result)
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.email
      const credential = GoogleAuthProvider.credentialFromError(error)
    }
  }

  private parseSignInResult = (result: UserCredential) => {
    try {
      const credential = GoogleAuthProvider.credentialFromResult(result)
      if (!credential) throw new Error('No credentials was returned')
      let displayName = result.user.displayName || ''
      if (!displayName && result.user.providerData?.length) {
        displayName =
          result.user.providerData[0].displayName?.split(' ')[0] || ''
      }
      const user: Pick<User, 'email' | 'name' | 'uid'> = {
        email: result.user.email || '',
        name: displayName,
        uid: result.user.uid
      }
      this.api.createUser(user)
    } catch (e: any) {
      console.log(e)
    }
  }
}
