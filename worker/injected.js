const XHR = XMLHttpRequest.prototype;
const open = XHR.open;
const send = XHR.send;
const setRequestHeader = XHR.setRequestHeader;

XHR.send = function () {
  this.addEventListener('load', function () {
    const url = this.responseURL;
    const responseHeaders = this.getAllResponseHeaders();
    console.log(this.response);
    window.postMessage({ type: 'test', message: 'yo' }, '*');
    try {
      if (this.responseType != 'blob') {
        let responseBody;
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

const constantMock = window.fetch;
window.fetch = function () {
  console.log(arguments);

  return new Promise((resolve, reject) => {
    // @ts-ignore
    constantMock
      .apply(this, arguments)
      .then((response) => {
        console.log(response);
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
