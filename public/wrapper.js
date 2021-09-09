// TODO: Look into why manifest v3 doesn't work with module imports
var headerListener = function (details) {
  var _a;
  var fileSize;
  (_a = details.responseHeaders) === null || _a === void 0
    ? void 0
    : _a.forEach(function (header) {
        if (header.name.toLowerCase() == 'content-length') fileSize = header.value;
      });
  if (!fileSize && details.type !== 'xmlhttprequest') {
    console.error('Unable to find file size: ' + details.type);
    console.log(details);
  } else {
    console.log(details.url + ': ' + fileSize);
  }
};
try {
  chrome.webRequest.onHeadersReceived.addListener(headerListener, { urls: ['<all_urls>'] }, ['responseHeaders']);
  chrome.runtime.onMessage.addListener(function (details) {
    console.log(details);
  });
} catch (e) {
  console.error(e);
}
export {};
