var XHR = XMLHttpRequest.prototype;
// @ts-ignore
var open = XHR.open;
var send = XHR.send;
var setRequestHeader = XHR.setRequestHeader;
/*function sendMessage(message: NetworkCall) {
  return window.postMessage({ type: 'networkCall', message }, '*')
}*/
XHR.send = function () {
  this.addEventListener('load', function () {
    var url = this.responseURL;
    var responseHeaders = this.getAllResponseHeaders();
    console.log(this.response);
    window.postMessage({ type: 'test', message: 'yo' }, '*');
    try {
      if (this.responseType != 'blob') {
        var responseBody = void 0;
        if (this.responseType === '' || this.responseType === 'text') {
          responseBody = JSON.parse(this.responseText);
        } /* if (this.responseType === 'json') */ else {
          responseBody = this.response;
        }
        console.log(responseBody);
        // Do you stuff HERE.
      }
    } catch (err) {
      console.debug('Error reading or processing response.', err);
    }
  });
  // @ts-ignore
  return send.apply(this, arguments);
};
