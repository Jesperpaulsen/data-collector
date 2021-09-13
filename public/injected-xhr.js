var getContentType = function (header) {
  var knownHeaderTypes = ['arraybuffer', 'blob', 'json', 'text'];
  if (header in knownHeaderTypes) return header;
  return 'json';
};
var getContentTypeHeader = function (header) {
  if (!header) return 'json';
  var contentTypeHeaders = header.split('/');
  if (contentTypeHeaders[0] === 'text') {
    return 'text';
  } else if (contentTypeHeaders[0] === 'application' && contentTypeHeaders.length > 1) {
    return getContentType(contentTypeHeaders[1]);
  } else {
    return 'text';
  }
};
var originalXHR = window.XMLHttpRequest;
function mockXHR() {
  var xhr = new originalXHR();
  xhr.addEventListener(
    'readystatechange',
    function async() {
      if (xhr.readyState === 4) {
        var networkCall = {
          headers: xhr.getAllResponseHeaders(),
          type: getContentTypeHeader(xhr.getResponseHeader('content-type')),
          url: xhr.responseURL,
          data: xhr.response,
          timestamp: Math.floor(Date.now().valueOf() / 100),
        };
        window.postMessage({ type: 'networkCall', networkCall: networkCall }, '*');
      }
    },
    false
  );
  return xhr;
}
// @ts-ignore
window.XMLHttpRequest = mockXHR;
