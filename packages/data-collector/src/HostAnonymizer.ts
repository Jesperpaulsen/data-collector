import { NetworkCall, StrippedNetworkCall } from '../../types/src/network-call'

import Store from './store'

export class HostAnonymizer {
  private store: typeof Store

  constructor(store: typeof Store) {
    this.store = store
  }

  private getHostName = (url: string) => {
    if (!url) return ''
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
  }

  private createHostAlias = () => {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < 28; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  convertHostToAlias = (
    hostOrigin: NetworkCall['hostOrigin']
  ): StrippedNetworkCall['hostOrigin'] => {
    if (!hostOrigin) return ''

    const hostName = this.getHostName(hostOrigin)

    const alias = this.store.storageHandler.getHostAlias(hostName)
    if (alias) return alias
    const generatedAlias = this.createHostAlias()
    this.store.storageHandler.storeHost(hostName, generatedAlias)
    return generatedAlias
  }

  getAllAliases = async (): Promise<[string, string][]> => {
    const hostMap = await this.store.storageHandler.getAnonymizedHosts()
    const res: [string, string][] = []
    for (const [host, alias] of Object.entries(hostMap)) {
      res.push([alias, host])
    }
    return res
  }

  updateHostMap = () => {}
}
