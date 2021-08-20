chrome.webRequest.onResponseStarted.addListener(function (details) {
  console.log(details);
});
