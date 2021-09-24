import { NetworkCall } from '@data-collector/types'

import Hasher from './Hasher'
import Store from './store'

export class DuplicateHandler {
  private store: typeof Store

  constructor(store: typeof Store) {
    this.store = store
  }

  private checkIfDuplicate = (
    existingNetworkCall: NetworkCall,
    newNetworkCall: NetworkCall
  ) => {
    return (
      existingNetworkCall.manuallyCalculated !==
      newNetworkCall.manuallyCalculated
    )
  }

  private storeLargestNetworkCall = (
    hash: number,
    existingNetworkCall: NetworkCall,
    newNetworkCall: NetworkCall
  ) => {
    const networkCallToStore =
      (newNetworkCall.size || 0) > (existingNetworkCall.size || 0)
        ? newNetworkCall
        : existingNetworkCall
    this.store.storageHandler.storeNetworkCall(hash, networkCallToStore)
  }

  handleNetworkCall = (networkCall: NetworkCall) => {
    console.log(networkCall)
    const hash = Hasher.createNetworkCallHash(networkCall)
    const existingNetworkCall = this.store.storageHandler.getNetworkCall(hash)

    if (!existingNetworkCall) {
      this.store.storageHandler.storeNetworkCall(hash, networkCall)
      return
    }

    if (this.checkIfDuplicate(existingNetworkCall, networkCall)) {
      this.storeLargestNetworkCall(hash, existingNetworkCall, networkCall)
    } else {
      const fakeHash = Hasher.createNetworkCallHash(networkCall, {
        fakeHash: true
      })
      this.store.storageHandler.storeNetworkCall(fakeHash, networkCall)
    }
  }
}
