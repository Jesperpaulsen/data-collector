var urlHashMapWithSize = {};
var networkCallsMissingSize = {};
var allRequests = {};
var generateHash = function (stringToHash) {
  var hash = 0;
  var chr;
  if (stringToHash.length === 0) return hash;
  for (var i = 0; i < stringToHash.length; i++) {
    chr = stringToHash.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};
var createNetworkCallAndTimestampString = function (url, timestamp) {
  return '' + url + timestamp;
};
var createNetworkCallHash = function (url, timestamp) {
  var urlAndTimestampString = createNetworkCallAndTimestampString(url, timestamp);
  var hash = generateHash(urlAndTimestampString);
  return hash;
};
var storeNetworkCall = function (networkCall) {
  var networkCallHash = createNetworkCallHash(networkCall.url, networkCall.timestamp);
  var existingNetworkCall = urlHashMapWithSize[networkCallHash];
  var url = networkCall.url;
  if (!networkCall.size && !existingNetworkCall) networkCallsMissingSize[networkCall.url] = networkCall;
  if (existingNetworkCall) {
    if (
      existingNetworkCall.size &&
      networkCall.size &&
      ((existingNetworkCall.manuallyCalculated && !networkCall.manuallyCalculated) ||
        (networkCall.manuallyCalculated && !existingNetworkCall.manuallyCalculated))
    ) {
      console.log('Found conflict for url: ' + networkCall.url);
      if (existingNetworkCall.size > networkCall.size) {
        allRequests[url] = existingNetworkCall;
      } else {
        allRequests[url] = networkCall;
        urlHashMapWithSize[networkCallHash] = networkCall;
      }
    }
  } else if (networkCall.size) {
    allRequests[url] = networkCall;
    urlHashMapWithSize[url] = networkCall;
  }
};
setInterval(function () {
  console.log('Missing size for: ' + Object.keys(networkCallsMissingSize).length);
  console.log(
    'Number of kbytes used: ' +
      Object.values(allRequests).reduce(function (prevValue, currentValue) {
        return Number(prevValue) + Number(currentValue.size);
      }, 0) /
        1024
  );
}, 5000);
// TODO: Look into why manifest v3 doesn't work with module imports
var headerListener = function (details) {
  var _a;
  var fileSize;
  var headers = '';
  var timestamp = Math.floor(Date.now().valueOf() / 100);
  (_a = details.responseHeaders) === null || _a === void 0
    ? void 0
    : _a.forEach(function (header) {
        headers += header.name + ': ' + header.value;
        if (header.name.toLowerCase() == 'content-length') fileSize = header.value;
      });
  var networkCall = {
    headers: headers,
    timestamp: timestamp,
    type: 'text',
    url: details.url,
    size: fileSize,
    manuallyCalculated: false,
  };
  storeNetworkCall(networkCall);
};
try {
  chrome.webRequest.onHeadersReceived.addListener(headerListener, { urls: ['<all_urls>'] }, ['responseHeaders']);
  chrome.runtime.onMessage.addListener(function (details) {
    var networkCall = details.networkCall;
    storeNetworkCall(networkCall);
    console.log(networkCall.url + ': ' + networkCall.timestamp);
  });
} catch (e) {
  console.error(e);
}
