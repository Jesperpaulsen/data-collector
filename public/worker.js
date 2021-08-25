chrome.runtime.onInstalled.addListener(function (details) {
  console.log(details);
});
chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    var _a;
    var fileSize;
    (_a = details.responseHeaders) === null || _a === void 0
      ? void 0
      : _a.forEach(function (v, i, a) {
          if (v.name.toLowerCase() == 'content-length') fileSize = v.value;
        });
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
