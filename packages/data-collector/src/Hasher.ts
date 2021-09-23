import { NetworkCall } from '@data-collector/types'

class Hasher {
  private generateHash = (stringToHash: string) => {
    let hash = 0
    if (stringToHash.length === 0) return hash
    for (let i = 0; i < stringToHash.length; i++) {
      const chr = stringToHash.charCodeAt(i)
      hash = (hash << 5) - hash + chr
      hash |= 0
    }
    return hash
  }

  createNetworkCallAndTimestampString = (url: string, timestamp: number) =>
    `${url}${timestamp}`

  createNetworkCallHash = (
    networkCall: NetworkCall,
    { fakeHash } = { fakeHash: false }
  ) => {
    let url = `${networkCall.hostOrigin}${networkCall.hostPathname}${networkCall.targetOrigin}${networkCall.targetPathname}`
    if (fakeHash) {
      url += Math.random().toString(36)
    }

    const urlAndTimestampString = this.createNetworkCallAndTimestampString(
      url,
      networkCall.timestamp
    )
    const hash = this.generateHash(urlAndTimestampString)
    return hash
  }
}

export default new Hasher()
