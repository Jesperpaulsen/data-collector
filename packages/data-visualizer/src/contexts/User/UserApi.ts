import { doc, getDoc, query } from 'firebase/firestore'

import Firestore from '../../services/Firestore'
import { HTTPClient } from '../../services/HttpClient'
import User from '../../types/User'

import { UserHandler } from './UserHandler'

export class UserApi {
  private userHandler: UserHandler
  private httpClient: HTTPClient

  constructor(userHandler: UserHandler) {
    this.userHandler = userHandler
    this.httpClient = new HTTPClient(this.userHandler.getUserToken)
  }

  getUser = async (uid?: string) => {
    if (!uid) return
    const d = doc(Firestore.userCollection, uid)
    const snapshot = await getDoc(d)
    return snapshot.data() as User
  }

  createUser = async (user: Pick<User, 'email' | 'name' | 'uid'>) => {
    try {
      await this.httpClient.doRequest(
        `/users/extension/${user.uid}`,
        'POST',
        user
      )
    } catch (e) {
      console.log(e)
    }
  }
}
