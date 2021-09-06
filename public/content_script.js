var checkIfChromeIsReady = function () {
  return typeof chrome.runtime.getURL;
};
var messagesToSend = [];
var s = document.createElement('script');
s.src = chrome.runtime.getURL('injected.js');
window.addEventListener('message', function (event) {
  var _a;
  if (((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === 'test') {
    try {
      chrome.runtime.sendMessage(event.data.message);
      for (var _i = 0, messagesToSend_1 = messagesToSend; _i < messagesToSend_1.length; _i++) {
        var message = messagesToSend_1[_i];
        chrome.runtime.sendMessage(message.data.message);
      }
    } catch (e) {
      messagesToSend.push(event);
    }
  }
});
s.onload = function () {
  // @ts-ignore
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
