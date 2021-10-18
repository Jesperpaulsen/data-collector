export class HTTPClient {
  // @TODO change base url
  private baseUrl =
    window.location.host === 'localhost:3000'
      ? 'https://data-collector-ff33b.ew.r.appspot.com'
      : 'http://localhost:3333'

  private getUserToken?: () => Promise<string>

  constructor(getUserTokenMethod: () => Promise<string>) {
    this.getUserToken = getUserTokenMethod
  }

  private getToken = async () => {
    let token = ''
    if (this.getUserToken) {
      try {
        token = await this.getUserToken()
      } catch (e) {
        console.error(e)
      }
    }
    if (!token.length) console.error('No token was set')
    return token
  }

  doRequest = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any
  ) => {
    if (!url.startsWith('/'))
      throw Error('Make sure to add a valid request URL that starts with "/"')

    const token = await this.getToken()
    return fetch(`${this.baseUrl}${url}`, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }
}
