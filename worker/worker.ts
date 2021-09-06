class WebWorker {
  constructor() {
    this.initalize();
  }

  private initalize() {
    chrome.runtime.onMessage.addListener((event: MessageEvent) => {
      const data = event.data;
      console.log(data);
      if (!data) return;
    });
  }
}

export default new WebWorker();
