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