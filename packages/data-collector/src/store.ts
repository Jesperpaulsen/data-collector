import { UserCredential } from 'firebase/auth'
import { API } from './API'
import { Auth } from './Auth'
import { MESSAGE_TYPES } from '@data-collector/types'
import { DuplicateHandler } from './DuplicateHandler'
import { DataReporter } from './DataReporter'
import { StorageHandler } from './StorageHandler'
import { UsageCounter } from './UsageCounter'

class Store {
  api: API
  auth: Auth
  duplicateHandler: DuplicateHandler
  dataReporter: DataReporter
  storageHandler: StorageHandler
  usageCounter: UsageCounter
  user?: UserCredential['user']

  constructor() {
    this.api = new API(this)
    this.auth = new Auth(this)
    this.duplicateHandler = new DuplicateHandler(this)
    this.dataReporter = new DataReporter(this)
    this.storageHandler = new StorageHandler(this)
    this.usageCounter = new UsageCounter(this)
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