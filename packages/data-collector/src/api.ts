import { UserCredential } from 'firebase/auth'

class API {
  private baseUrl = 'http://localhost:3333'
  private user?: UserCredential['user']

  private doRequest = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any
  ) => {
    const token = await this.user?.getIdToken()
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

  setUser = (user: UserCredential['user']) => {
    this.user = user
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
    console.log(res)
  }
}

export default new API()
