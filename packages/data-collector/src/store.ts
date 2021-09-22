import { UserCredential } from 'firebase/auth'
import { API } from './api'
import { Auth } from './auth'
import { MESSAGE_TYPES } from '@data-collector/types'

class Store {
  api: API
  auth: Auth
  user?: UserCredential['user']

  constructor() {
    this.api = new API(this)
    this.auth = new Auth(this)
  }

  setUser = (user: UserCredential['user']) => {
    const initialUser = this.user
    this.user = user
    if (!initialUser) this.sendUser()
  }

  sendUser = () => {
    if (!this.user) return
    const { email, uid, displayName } = this.user
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.SEND_USER,
      payload: { email, uid, name: displayName }
    })
  }
}

export default new Store()
