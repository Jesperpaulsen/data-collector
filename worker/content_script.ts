var s = document.createElement('script');
s.src = chrome.runtime.getURL('injected.js');
s.onload = function () {
  // @ts-ignore
  // this.remove();
};
(document.head || document.documentElement).appendChild(s);
