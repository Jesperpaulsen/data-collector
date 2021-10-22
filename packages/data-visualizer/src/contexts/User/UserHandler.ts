import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  UserCredential,
  onAuthStateChanged,
  connectAuthEmulator
} from 'firebase/auth'

import { extensionID } from '../../utils/extensionID'
import { isMobile } from '../../utils/isMobile'

import { firebase } from '../../services/Firebase'
import { GenericHandler } from '../../types/GenericHandler'
import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES'
import { UserApi } from './UserApi'

import { UserState } from './UserState'

const auth = getAuth(firebase)
// @ts-ignore
const isEmulator = import.meta.env.EMULATOR
if (isEmulator) connectAuthEmulator(auth, 'http://localhost:9099')

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
      if (authState) {
        const user = await this.api.getUser(authState.uid)
        if (user) {
          this.setState({ currentUser: user })
        } else {
          this.setState({
            currentUser: {
              name: authState.displayName || '',
              uid: authState.uid,
              numberOfCalls: 0,
              role: 'user',
              totalCO2: 0,
              totalkWh: 0,
              totalSize: 0
            }
          })
        }
      } else {
        this.setState({ currentUser: undefined })
      }
    })
  }

  private setUp = async () => {
    try {
      const redirectResult = await this.checkIfRedirect()
      if (redirectResult) {
        this.parseSignInResult(redirectResult)
      }
      const isAvailable = isEmulator
        ? false
        : await this.checkIfExtensionIsAvailable()
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
        extensionID,
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
        extensionID,
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
      console.log(error)
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
      const user: { email: string; name: string; uid: string } = {
        email: result.user.email || '',
        name: displayName,
        uid: result.user.uid
      }
      this.api.createUser(user)
    } catch (e: any) {
      console.log(e)
    }
  }

  signOut = () => {
    this.client.signOut()
  }
}
