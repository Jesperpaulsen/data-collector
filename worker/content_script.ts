const checkIfChromeIsReady = () => typeof chrome.runtime.getURL;
const messagesToSend: MessageEvent[] = [];

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

const scriptsToLoad = ['injected-fetch.js', 'injected-xhr.js'];

for (const path of scriptsToLoad) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(path);
  script.onload = function () {
    // @ts-ignore
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}
