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

  private getIPAdress = (
    existingNetworkCall: NetworkCall,
    newNetworkCall: NetworkCall
  ) => {
    if (!existingNetworkCall.manuallyCalculated)
      return existingNetworkCall.targetIP
    else return newNetworkCall.targetIP
  }

  private checkIfCache = (
    existingNetworkCall: NetworkCall,
    newNetworkCall: NetworkCall
  ) => {
    if (!existingNetworkCall.manuallyCalculated)
      return existingNetworkCall.fromCache
    else return newNetworkCall.fromCache
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
    networkCallToStore.targetIP = this.getIPAdress(
      existingNetworkCall,
      newNetworkCall
    )
    networkCallToStore.fromCache = this.checkIfCache(
      existingNetworkCall,
      newNetworkCall
    )
    console.log(networkCallToStore.targetOrigin)
    this.store.storageHandler.storeNetworkCall(hash, networkCallToStore)
  }

  private isInternalNetworkCall = (networkCall: NetworkCall) => {
    return (
      networkCall.targetOrigin ===
        'chrome-extension://jkoeemadehedckholhdkcjnadckenjgd' ||
      networkCall.targetIP === '::1' ||
      networkCall.targetOrigin ===
        'https://data-collector-ff33b.ew.r.appspot.com'
    )
  }

  handleNetworkCall = (networkCall: NetworkCall) => {
    if (this.isInternalNetworkCall(networkCall)) return

    const hash = Hasher.createNetworkCallHash(networkCall)
    const existingNetworkCall = this.store.storageHandler.getNetworkCall(hash)

    if (!existingNetworkCall) {
      this.store.storageHandler.storeNetworkCall(hash, networkCall)
      return
    }
    console.log(`${networkCall?.targetOrigin} ${networkCall?.targetPathname}`)
    if (this.checkIfDuplicate(existingNetworkCall, networkCall)) {
      console.log('Duplicate')
      this.storeLargestNetworkCall(hash, existingNetworkCall, networkCall)
    } else {
      console.log('Not duplicate')
      const fakeHash = Hasher.createNetworkCallHash(networkCall, {
        fakeHash: true
      })
      this.store.storageHandler.storeNetworkCall(fakeHash, networkCall)
    }
  }
}
