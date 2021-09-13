var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
    return r;
  };
var _a;
var currentUrl = window.location.host;
var MESSAGE_TYPES;
(function (MESSAGE_TYPES) {
  MESSAGE_TYPES['ARRAY_BUFFER'] = 'arraybuffer';
  MESSAGE_TYPES['BLOB'] = 'blob';
  MESSAGE_TYPES['JSON'] = 'json';
  MESSAGE_TYPES['TEXT'] = 'text';
})(MESSAGE_TYPES || (MESSAGE_TYPES = {}));
var dataTypeToSizeMap =
  ((_a = {}),
  (_a[MESSAGE_TYPES.ARRAY_BUFFER] = function (data) {
    return data.byteLength;
  }),
  (_a[MESSAGE_TYPES.BLOB] = function (data) {
    return data.size;
  }),
  (_a[MESSAGE_TYPES.JSON] = function (data) {
    return new TextEncoder().encode(JSON.stringify(data)).length;
  }),
  (_a[MESSAGE_TYPES.TEXT] = function (data) {
    return new Blob([data]).size;
  }),
  _a);
var calculateBodySize = function (body, type) {
  var methodUsedToCalculateSize = dataTypeToSizeMap[type];
  if (!methodUsedToCalculateSize) return null;
  return methodUsedToCalculateSize(body);
};
var messagesToSend = [];
var sendMessages = function () {
  var messages = __spreadArrays(messagesToSend);
  messagesToSend = [];
  for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
    var message = messages_1[_i];
    try {
      console.log(message);
      chrome.runtime.sendMessage({ type: 'networkCall', networkCall: message });
    } catch (e) {
      console.log(e);
      messagesToSend.push(message);
    }
  }
};
var sendMessage = function (networkCall) {
  messagesToSend.push(networkCall);
  sendMessages();
};
var handleIncommingMessage = function (_a) {
  var type = _a.type,
    url = _a.url,
    headers = _a.headers,
    timestamp = _a.timestamp,
    data = _a.data;
  var bodySize = calculateBodySize(data, type) || 0;
  var headerSize = calculateBodySize(headers, MESSAGE_TYPES.TEXT) || 0;
  var size = bodySize + headerSize;
  var networkCall = {
    type: type,
    size: size,
    url: url,
    headers: headers,
    timestamp: timestamp,
    manuallyCalculated: true,
  };
  sendMessage(networkCall);
};
window.addEventListener(
  'message',
  function (event) {
    var _a;
    if (event.source !== window) {
      return;
    }
    if (((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === 'networkCall') {
      var networkCall = event.data.networkCall;
      handleIncommingMessage({
        type: networkCall.type,
        url: networkCall.url,
        headers: networkCall.headers,
        data: networkCall.data,
        timestamp: networkCall.timestamp,
      });
    }
  },
  false
);
var scriptsToLoad = ['injected-xhr.js', 'injected-fetch.js'];
for (var _i = 0, scriptsToLoad_1 = scriptsToLoad; _i < scriptsToLoad_1.length; _i++) {
  var path = scriptsToLoad_1[_i];
  var script = document.createElement('script');
  script.src = chrome.runtime.getURL(path);
  script.onload = function () {
    // @ts-ignore
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}
