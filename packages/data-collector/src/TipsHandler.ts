import { MESSAGE_TYPES, Tip } from '@data-collector/types'

import Sanity from './Sanity'
import Store from './store'

export class TipsHandler {
  private store: typeof Store
  private tips: Tip[] = []

  constructor(store: typeof Store) {
    this.store = store
    this.loadTips()
  }

  private loadTips = async () => {
    try {
      const tips = await Sanity.fetchTips()
      this.tips = tips
    } catch (e) {
      console.log(e)
    }
  }

  dateHasChanged = async () => {
    await this.loadTips()
    this.sendTips()
  }

  sendTips = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.SEND_TIPS,
      payload: { tips: this.tips }
    })
  }
}
