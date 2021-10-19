import { NetworkCall, StrippedNetworkCall } from '@data-collector/types'

import Store from './store'
export class API {
  private store: typeof Store
  private baseUrl = 'https://data-collector-ff33b.ew.r.appspot.com'

  constructor(store: typeof Store) {
    this.store = store
  }

  private doRequest = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any
  ) => {
    const token = await this.store.user?.getIdToken()
    if (!token) console.error('No token was set')
    return fetch(`${this.baseUrl}${url}`, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }

  createUser = async (user: { name: string; uid: string; email: string }) => {
    const res = await this.doRequest(
      `/users/extension/${user.uid}`,
      'POST',
      user
    )
    if (!res.ok) {
      console.log('Not ok')
      res.json().then((body) => console.log(body))
    }
  }

  createNetworkCall = async (networkCall: NetworkCall) => {
    const res = await this.doRequest('/network-call', 'POST', networkCall)
    if (!res.ok) {
      res.json().then((body) => console.log(body))
    }
  }

  createNetworkCalls = async (networkCalls: StrippedNetworkCall[]) => {
    const res = await this.doRequest('/network-call/batch', 'POST', {
      userId: this.store.user?.uid,
      networkCalls
    })
    if (!res.ok) {
      res.json().then((body) => console.log(body))
    }
  }

  reportUserActive = async () => {
    const res = await this.doRequest(
      `/users/active/${this.store.user?.uid}`,
      'PUT'
    )
    return res.json()
  }

  getAllNetworkCallsForUser = async () => {
    const res = await this.doRequest(
      `/network-call/user/${this.store.user?.uid}`,
      'GET'
    )
    return res.json()
  }
}
