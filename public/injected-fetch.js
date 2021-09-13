// Something goes wrong when ts compiles this to JS. This file is therefore stored as JS for now.

// TODO: Refactor this with parcel or similar

const constantMock = window.fetch;

const bodyParserMethods = {
  json: (body) => body.json(),
  text: (body) => body.text(),
  blob: (body) => body.blob(),
  arraybuffer: (body) => body.arrayBuffer(),
};

const bruteForceBodyType = async (body) => {
  for (const { type, parserMethod } of Object.entries(bodyParserMethods)) {
    try {
      data = await parserMethod(body.clone());
      return { data, type };
    } catch (e) {
      // pass
    }
  }
};

const parseBody = async (body, headers) => {
  const contentTypeHeader = headers.get('content-type');
  if (contentTypeHeader) {
    // These methods are currently fetched from the injected-xhr after the scripts are mounted to the dom
    const type = getContentTypeHeader(headers.get('content-type'));
    const bodyParser = bodyParserMethods[type];
    return {
      type,
      data: await bodyParser(body),
    };
  } else {
    return bruteForceBodyType(body);
  }
};

const parseHeaders = (headers) => {
  let headerString = '';
  headers.forEach((value, name) => {
    headerString += `${name}: ${value}`;
  });
  return headerString;
};

window.fetch = function () {
  // console.log(arguments.headers.values());
  return new Promise((resolve, reject) => {
    // @ts-ignore
    constantMock
      .apply(this, arguments)
      .then((response) => {
        const resClone = response.clone();
        const headerString = parseHeaders(resClone.headers);
        const timestamp = Math.floor(Date.now().valueOf() / 100);
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
                  headers: headerString,
                  timestamp,
                },
              },
              '*'
            );
          } else {
            console.log(`Unable to parse data from url: ${resClone.url}`);
          }
        });
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
