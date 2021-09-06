export const registerHeaderListener = () => {
  chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
      var fileSize;
      details.responseHeaders?.forEach((header) => {
        if (header.name.toLowerCase() == 'content-length') fileSize = header.value;
      });
      // @ts-ignore
      console.log(details.type === 'fetch');
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
};
