// import {registerHeaderListener} from './header_listener'
try {
  // registerHeaderListener()
  chrome.runtime.onMessage.addListener(function (details) {
    console.log(details);
  });
  // registerHeaderListener(worker)
} catch (e) {
  console.error(e);
}
