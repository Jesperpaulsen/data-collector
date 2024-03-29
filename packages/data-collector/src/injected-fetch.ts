import { MESSAGE_TYPES, NetworkCall } from '@data-collector/types'

import { getNetworkCallTimestamp } from './date'
import { getContentTypeHeader } from './utils'
const bodyParserMethods: { [key: string]: (body: any) => Promise<void> } = {
  json: (body) => body.json(),
  text: (body) => body.text(),
  blob: (body) => body.blob(),
  arraybuffer: (body) => body.arrayBuffer()
}

const bruteForceBodyType = async (body: any) => {
  for (const [type, parserMethod] of Object.entries(bodyParserMethods)) {
    try {
      const data = await parserMethod(body.clone())
      return { data, type }
    } catch (e) {
      // pass
    }
  }
  const data = await body.json()
  return { data, type: 'json' }
}

const parseBody = async (body: any, headers: Headers) => {
  const contentTypeHeader = headers.get('content-type')
  if (contentTypeHeader) {
    const type = getContentTypeHeader(headers.get('content-type'))
    const bodyParser = bodyParserMethods[type] || bodyParserMethods.text
    return {
      type,
      data: await bodyParser(body)
    }
  } else {
    return bruteForceBodyType(body)
  }
}

const parseHeaders = (headers: Headers) => {
  let headerString = ''
  headers.forEach((value, name) => {
    headerString += `${name}: ${value}`
  })
  return headerString
}

const constantMock = window.fetch
// @ts-ignore
window.fetch = constantMock
  ? function () {
      // console.log(arguments.headers.values());
      return new Promise((resolve, reject) => {
        constantMock
          // @ts-ignore
          .apply(this, arguments)
          .then((response) => {
            const resClone = response.clone()
            const headerString = parseHeaders(resClone.headers)
            const timestamp = getNetworkCallTimestamp()
            const url = new URL(resClone.url)
            const targetPathname = url.pathname
            const targetOrigin = url.origin
            parseBody(resClone, resClone.headers).then((result) => {
              if (result) {
                const networkCall: NetworkCall = {
                  type: result.type as NetworkCall['type'],
                  targetPathname,
                  targetOrigin,
                  headers: headerString,
                  data: result.data,
                  timestamp,
                  hostPathname: window.location.pathname,
                  hostOrigin: window.location.origin
                }
                window.postMessage(
                  {
                    type: MESSAGE_TYPES.NETWORK_CALL,
                    networkCall
                  },
                  '*'
                )
              } else {
                console.log(`Unable to parse data from url: ${resClone.url}`)
              }
            })
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  : undefined
