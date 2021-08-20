chrome.webRequest.onResponseStarted.addListener((details) => {
  console.log(details);
});
