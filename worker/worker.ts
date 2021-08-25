chrome.runtime.onInstalled.addListener((details) => {
  console.log(details);
});

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    var fileSize;
    details.responseHeaders?.forEach(function (v, i, a) {
      if (v.name.toLowerCase() == 'content-length') fileSize = v.value;
    });

    if (!fileSize && details.type !== 'xmlhttprequest') {
      console.error('Unable to find file size: ' + details.type);
      console.log(details);
    } else {
      console.log(`${details.url}: ${fileSize}`);
    }
  },
  { urls: ['<all_urls>'] },
  ['responseHeaders']
);
