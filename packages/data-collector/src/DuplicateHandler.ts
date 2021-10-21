import { NetworkCall } from '@data-collector/types'

import Hasher from './Hasher'
import Store from './store'
import { getUrlFromNetworkCall } from './utils'

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
      (newNetworkCall.size || 0) + (newNetworkCall.outgoingSize || 0) >
      (existingNetworkCall.size || 0) + (existingNetworkCall.outgoingSize || 0)
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

  private getSizeFromOutgoingRequest = (networkCall: NetworkCall) => {
    if (!networkCall.requestId) return 0

    const sentRequest = this.store.sentRequestsHandler.getRequest(
      networkCall.requestId
    )

    return sentRequest?.size || 0
  }

  handleNetworkCall = (networkCall: NetworkCall) => {
    this.store.dateHandler.userIsActive()
    if (this.isInternalNetworkCall(networkCall)) return

    const hash = Hasher.createNetworkCallHash(networkCall)
    const existingNetworkCall = this.store.storageHandler.getNetworkCall(hash)
    networkCall.outgoingSize = this.getSizeFromOutgoingRequest(networkCall)

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
