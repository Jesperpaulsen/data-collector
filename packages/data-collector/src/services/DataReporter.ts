/**
 * TODO:
 * * Update database with network calls every 5 sec
 * * Determine data structure
 */

import { NetworkCall } from '../../../types/src/network-call'

export class DataReporter {
  private currentRequests: NetworkCall[] = []
  private userToken: string
  interval = 5000
  private timeout?: ReturnType<typeof setTimeout>

  constructor(userToken: string) {
    this.userToken = userToken
  }

  sendRequests = async () => {
    const promises: Promise<void>[] = []
    const requests = [...this.currentRequests]
    this.currentRequests = []

    for (const request of requests) {
      promises.push(this.sendRequest(request))
    }
    await Promise.all(promises)
  }

  private sendRequest = async (request: NetworkCall) => {
    try {
      // TODO: Do request
      console.log('Sending request ' + request)
    } catch (e) {
      console.error(e)
      this.currentRequests.push(request)
    }
  }

  addRequest(request: NetworkCall) {
    this.currentRequests.push(request)
  }
}
