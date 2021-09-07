// TODO: Look into why manifest v3 doesn't work with module imports
const headerListener = (details: chrome.webRequest.WebResponseHeadersDetails) => {
  var fileSize;
  details.responseHeaders?.forEach((header) => {
    if (header.name.toLowerCase() == 'content-length') fileSize = header.value;
  });
  if (!fileSize && details.type !== 'xmlhttprequest') {
    console.error('Unable to find file size: ' + details.type);
    console.log(details);
  } else {
    console.log(`${details.url}: ${fileSize}`);
  }
};

export { headerListener };

try {
  chrome.webRequest.onHeadersReceived.addListener(headerListener, { urls: ['<all_urls>'] }, ['responseHeaders']);
  chrome.runtime.onMessage.addListener(function (details) {
    console.log(details);
  });
} catch (e) {
  console.error(e);
}
