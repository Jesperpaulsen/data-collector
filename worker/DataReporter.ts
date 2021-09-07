/**
 * TODO:
 * * Update database with network calls every 5 sec
 * * Determine data structure
 */

export class DataReporter {
  private currentRequests: NetworkCall[] = [];
  private userToken: string;
  private interval = 5000;
  private timeout?: ReturnType<typeof setTimeout>;

  constructor(userToken: string) {
    this.userToken = userToken;
    this.startTimer();
  }

  private startTimer = () => {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.sendRequests();
    }, this.interval);
  };

  private sendRequests = async () => {
    const promises = [];
    const requests = [...this.currentRequests];
    this.currentRequests = [];

    for (const request of requests) {
      promises.push(this.sendRequest(request));
    }
    await Promise.all(promises);
    this.startTimer();
  };

  private sendRequest = async (request: NetworkCall) => {
    try {
      // TODO: Do request
    } catch (e) {
      console.error(e);
      this.currentRequests.push(request);
    }
  };

  addRequest(request: NetworkCall) {
    this.currentRequests.push(request);
  }
}
