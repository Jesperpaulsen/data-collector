var WebWorker = /** @class */ (function () {
  function WebWorker() {
    this.initalize();
  }
  WebWorker.prototype.initalize = function () {
    chrome.runtime.onMessage.addListener(function (event) {
      var data = event.data;
      console.log(data);
      if (!data) return;
    });
  };
  return WebWorker;
})();
export default new WebWorker();
