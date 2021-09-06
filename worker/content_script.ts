const checkIfChromeIsReady = () => typeof chrome.runtime.getURL;
const messagesToSend: MessageEvent[] = [];

const s = document.createElement('script');
s.src = chrome.runtime.getURL('injected.js');

window.addEventListener('message', (event) => {
  if (event.data?.type === 'test') {
    try {
      chrome.runtime.sendMessage(event.data.message);
      for (const message of messagesToSend) {
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
