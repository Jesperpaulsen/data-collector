import { getStartOfDateInUnix } from './date'
import Store from './store'

export class DateHandler {
  store: typeof Store
  private currentDate = getStartOfDateInUnix(new Date())

  constructor(store: typeof Store) {
    this.store = store
  }

  private checkIfDateHasChanged = () => {
    const today = getStartOfDateInUnix(new Date())
    if (this.currentDate !== today) {
      console.log('Date has changed')
      this.currentDate = today
      return true
    }
    return false
  }

  userIsActive = () => {
    const dateHasChanged = this.checkIfDateHasChanged()
    if (dateHasChanged) {
      this.store.api.reportUserActive()
      this.store.usageCounter.resetData()
    }
  }
}
