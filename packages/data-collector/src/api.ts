import { NetworkCall } from '@data-collector/types'

import { firebase } from './firebase'
import Store from './store'
export class API {
  private store: typeof Store
  private baseUrl = 'http://localhost:3333'

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

  createNetworkCalls = async (networkCalls: NetworkCall[]) => {
    const res = await this.doRequest('/network-call/batch', 'POST', {
      userId: this.store.user?.uid,
      networkCalls
    })
    if (!res.ok) {
      res.json().then((body) => console.log(body))
    }
  }

  getAllNetworkCallsForUser = async () => {
    const res = await this.doRequest(
      `/network-call/user/${this.store.user?.uid}`,
      'GET'
    )
    return res.json()
  }
}
