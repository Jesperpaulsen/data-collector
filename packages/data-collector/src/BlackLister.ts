import { MESSAGE_TYPES } from '@data-collector/types'

import Store from './store'

const storageKey = 'blacklistedPages'

export class BlackLister {
  store: typeof Store
  private blackListedPages = new Set<string>()

  constructor(store: typeof Store) {
    this.store = store
    this.getListFromLocalStorage().then(
      (list) => (this.blackListedPages = new Set(list))
    )
  }

  private storeListInStorage = async (list: string[]): Promise<void> => {
    return new Promise((resolve) =>
      chrome.storage.local.set({ [storageKey]: list }, resolve)
    )
  }

  private getListFromLocalStorage = async (): Promise<string[]> => {
    return new Promise((resolve) => {
      chrome.storage.local.get(storageKey, (result) =>
        resolve(result[storageKey])
      )
    })
  }

  addBlackListedPage = async (url: string) => {
    this.blackListedPages.add(url)
    this.storeListInStorage([...this.blackListedPages])
    this.sendBlackListedPages()
  }

  removeBlackListedPage = async (url: string) => {
    this.blackListedPages.delete(url)
    this.storeListInStorage([...this.blackListedPages])
    this.sendBlackListedPages()
  }

  checkIfUrlIsBlackListed = (url: string) => {
    return this.blackListedPages.has(url)
  }

  sendBlackListedPages = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.SEND_BLACKLISTED_PAGES,
      payload: [...this.blackListedPages]
    })
  }
}
