import { MESSAGE_TYPES } from '@data-collector/types'

import Store from './store'
const storageKey = 'extendedPollution'

export class ExtendedPollution {
  private store: typeof Store
  showExtendedPollution = false

  constructor(store: typeof Store) {
    this.store = store
    this.loadFromStorage()
  }

  private readLocalStorage = async (): Promise<{
    showExtendedPollution: boolean
  }> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(storageKey, (result) => {
        resolve(result[storageKey])
      })
    })
  }

  private writeToLocalStorage = async (
    showExtendedPollution: boolean
  ): Promise<void> => {
    return new Promise((resolve) => {
      chrome.storage.local.set({
        [storageKey]: { showExtendedPollution },
        resolve
      })
    })
  }

  sendExtendedPollution = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.SEND_EXTENDED_POLLUTION,
      payload: { extendedPollution: this.showExtendedPollution }
    })
  }

  setExtendedPollution = (value: boolean) => {
    this.showExtendedPollution = value
    this.writeToLocalStorage(value)
    this.sendExtendedPollution()
  }

  private loadFromStorage = async () => {
    const res = await this.readLocalStorage()
    this.showExtendedPollution = res?.showExtendedPollution || false
    this.sendExtendedPollution()
  }
}
