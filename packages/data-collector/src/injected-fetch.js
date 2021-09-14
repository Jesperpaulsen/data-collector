// Something goes wrong when ts compiles this to JS. This file is therefore stored as JS for now.
import { getContentTypeHeader } from './utils'
// TODO: Refactor this with parcel or similar

const bodyParserMethods = {
  json: (body) => body.json(),
  text: (body) => body.text(),
  blob: (body) => body.blob(),
  arraybuffer: (body) => body.arrayBuffer()
}

const bruteForceBodyType = async (body) => {
  for (const { type, parserMethod } of Object.entries(bodyParserMethods)) {
    try {
      const data = await parserMethod(body.clone())
      return { data, type }
    } catch (e) {
      // pass
    }
  }
}

const parseBody = async (body, headers) => {
  const contentTypeHeader = headers.get('content-type')
  if (contentTypeHeader) {
    const type = getContentTypeHeader(headers.get('content-type'))
    const bodyParser = bodyParserMethods[type]
    return {
      type,
      data: await bodyParser(body)
    }
  } else {
    return bruteForceBodyType(body)
  }
}

const parseHeaders = (headers) => {
  let headerString = ''
  headers.forEach((value, name) => {
    headerString += `${name}: ${value}`
  })
  return headerString
}

const constantMock = window.fetch
window.fetch = constantMock
  ? function () {
      // console.log(arguments.headers.values());
      return new Promise((resolve, reject) => {
        constantMock
          .apply(this, arguments)
          .then((response) => {
            const resClone = response.clone()
            const headerString = parseHeaders(resClone.headers)
            const timestamp = Math.floor(Date.now().valueOf() / 100)
            parseBody(resClone, resClone.headers).then((result) => {
              if (result) {
                window.postMessage(
                  {
                    type: 'networkCall',
                    networkCall: {
                      type: result.type,
                      url: resClone.url,
                      headers: headerString,
                      data: result.data,
                      timestamp
                    }
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
