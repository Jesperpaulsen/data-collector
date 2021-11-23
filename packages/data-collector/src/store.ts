import { UserCredential } from 'firebase/auth'
import { API } from './api'
import { Auth } from './auth'
import { MESSAGE_TYPES } from '@data-collector/types'
import { DuplicateHandler } from './DuplicateHandler'
import { DataReporter } from './DataReporter'
import { StorageHandler } from './StorageHandler'
import { UsageCounter } from './UsageCounter'
import { Firestore } from './Firestore'
import { BlackLister } from './BlackLister'
import { SentRequestsHandler } from './SentRequestsHandler'
import { DateHandler } from './DateHandler'
import { HabitsReporter } from './HabitsReporter'

class Store {
  api: API
  auth: Auth
  firestore: Firestore
  duplicateHandler: DuplicateHandler
  dataReporter: DataReporter
  storageHandler: StorageHandler
  usageCounter: UsageCounter
  user?: UserCredential['user']
  blackLister: BlackLister
  sentRequestsHandler: SentRequestsHandler
  dateHandler: DateHandler
  habitsReporter: HabitsReporter

  constructor() {
    this.api = new API(this)
    this.auth = new Auth(this)
    this.firestore = new Firestore(this)
    this.duplicateHandler = new DuplicateHandler(this)
    this.dataReporter = new DataReporter(this)
    this.storageHandler = new StorageHandler(this)
    this.usageCounter = new UsageCounter(this)
    this.blackLister = new BlackLister(this)
    this.sentRequestsHandler = new SentRequestsHandler(this)
    this.dateHandler = new DateHandler(this)
    this.habitsReporter = new HabitsReporter(this)
  }

  setUser = (user: UserCredential['user']) => {
    const initialUser = this.user
    this.user = user
    this.habitsReporter.getAverageUsage()
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
