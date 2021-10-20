// Because we don't get the IP adress, before the response is answered, we temporarily store the urls and size of the outgoing requests so we can get the size when the request is aanswered.

import { NetworkCall } from '@data-collector/types'

import { subtractSeconds } from './date'
import { Scheduler } from './Scheduler'
import Store from './store'

export class SentRequestsHandler {
  private store: typeof Store
  private scheduler = new Scheduler(1000)
  private requests = new Map<string, NetworkCall>()

  constructor(store: typeof Store) {
    this.store = store
    this.scheduler.setCallback(this.removeOldRequests)
  }

  private removeOldRequests = () => {
    const limit = subtractSeconds(8000)
    for (const request of new Map(this.requests)) {
      if (request[1].timestamp < limit) {
        this.requests.delete(request[0])
      }
    }
  }

  addRequest = (networkCall: NetworkCall) => {
    this.requests.set(networkCall.requestId!, networkCall)
  }

  updateSizeToRequest = (requestId: string, sizeToAdd: number) => {
    const request = this.requests.get(requestId)
    if (!request) return
    request.size = (request?.size || 0) + sizeToAdd
    this.requests.set(requestId, request)
  }

  getRequest = (requestId: string) => {
    const request = this.requests.get(requestId)
    if (request) this.requests.delete(requestId)
    return request
  }
}
