const getContentType = (header: string): XMLHttpRequestResponseType => {
  const knownHeaderTypes: XMLHttpRequestResponseType[] = ['arraybuffer', 'blob', 'json', 'text'];
  if (header in knownHeaderTypes) return header as XMLHttpRequestResponseType;
  return 'json';
};

const getContentTypeHeader = (header: string | null): XMLHttpRequestResponseType => {
  if (!header) return 'json';
  const contentTypeHeaders = header.split('/');
  if (contentTypeHeaders[0] === 'text') {
    return 'text';
  } else if (contentTypeHeaders[0] === 'application' && contentTypeHeaders.length > 1) {
    return getContentType(contentTypeHeaders[1]);
  } else {
    return 'text';
  }
};

const originalXHR = window.XMLHttpRequest;

function mockXHR() {
  const xhr = new originalXHR();
  xhr.addEventListener(
    'readystatechange',
    function async() {
      if (xhr.readyState === 4) {
        const networkCall: NetworkCall = {
          headers: xhr.getAllResponseHeaders(),
          type: getContentTypeHeader(xhr.getResponseHeader('content-type')),
          url: xhr.responseURL,
          data: xhr.response,
          timestamp: Math.floor(Date.now().valueOf() / 100),
        };
        window.postMessage({ type: 'networkCall', networkCall }, '*');
      }
    },
    false
  );
  return xhr;
}
// @ts-ignore
window.XMLHttpRequest = mockXHR;
