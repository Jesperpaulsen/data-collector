export var registerHeaderListener = function () {
  chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
      var _a;
      var fileSize;
      (_a = details.responseHeaders) === null || _a === void 0
        ? void 0
        : _a.forEach(function (header) {
            if (header.name.toLowerCase() == 'content-length') fileSize = header.value;
          });
      // @ts-ignore
      console.log(details.type === 'fetch');
      if (!fileSize && details.type !== 'xmlhttprequest') {
        console.error('Unable to find file size: ' + details.type);
        console.log(details);
      } else {
        console.log(details.url + ': ' + fileSize);
      }
    },
    { urls: ['<all_urls>'] },
    ['responseHeaders']
  );
};
