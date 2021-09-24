import { MESSAGE_TYPES } from '@data-collector/types'

import { NetworkCall } from '../../types/src/network-call'

enum DATA_TYPES {
  ARRAY_BUFFER = 'arraybuffer',
  BLOB = 'blob',
  JSON = 'json',
  TEXT = 'text'
}

const dataTypeToSizeMap: { [key in DATA_TYPES]: (data: any) => number } = {
  [DATA_TYPES.ARRAY_BUFFER]: (data) => (data as ArrayBuffer).byteLength,
  [DATA_TYPES.BLOB]: (data) => (data as Blob).size,
  [DATA_TYPES.JSON]: (data) =>
    new TextEncoder().encode(JSON.stringify(data)).length,
  [DATA_TYPES.TEXT]: (data) => new Blob([data]).size
}

const calculateBodySize = (body: any, type: DATA_TYPES) => {
  const methodUsedToCalculateSize = dataTypeToSizeMap[type]
  if (!methodUsedToCalculateSize) return null
  return methodUsedToCalculateSize(body)
}

let messagesToSend: NetworkCall[] = []

const sendMessages = () => {
  const messages = [...messagesToSend]
  messagesToSend = []
  for (const message of messages) {
    try {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.NETWORK_CALL,
        networkCall: message
      })
    } catch (e) {
      console.log(e)
      messagesToSend.push(message)
    }
  }
}

const sendMessage = (networkCall: NetworkCall) => {
  messagesToSend.push(networkCall)
  sendMessages()
}

const handleIncommingMessage = ({
  type,
  targetOrigin,
  targetPathname,
  headers,
  timestamp,
  data,
  hostPathname,
  hostOrigin
}: NetworkCall) => {
  const bodySize = calculateBodySize(data, type as DATA_TYPES) || 0
  const headerSize = calculateBodySize(headers, DATA_TYPES.TEXT) || 0
  const size = bodySize + headerSize
  const networkCall: NetworkCall = {
    type,
    size,
    targetOrigin,
    targetPathname,
    headers,
    timestamp,
    hostPathname,
    hostOrigin,
    manuallyCalculated: true
  }
  sendMessage(networkCall)
}

window.addEventListener(
  'message',
  (event: MessageEvent<{ type: string; networkCall: NetworkCall }>) => {
    if (event.source !== window || !event.data?.networkCall) {
      return
    }
    if (event.data?.type === MESSAGE_TYPES.NETWORK_CALL) {
      const networkCall = event.data.networkCall
      handleIncommingMessage(networkCall)
    }
  },
  false
)

const scriptsToLoad = ['injected-xhr.js', 'injected-fetch.js']
for (const path of scriptsToLoad) {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL(path)
  script.onload = function () {
    // @ts-ignore
    this.remove()
  }
  ;(document.head || document.documentElement).appendChild(script)
}
