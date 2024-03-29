export class Scheduler {
  private interval: number
  private timeout?: ReturnType<typeof setTimeout>
  private callback?: () => void | Promise<void>
  private nextCallbackTime = Date.now()

  constructor(interval: number) {
    this.interval = interval
  }

  readonly setCallback = (callback: () => void | Promise<void>) => {
    this.callback = callback
    this.setNextCallbackTime(this.interval)
  }

  readonly delayNextCallback = (delayInMillis: number) => {
    this.setNextCallbackTime(delayInMillis)
  }

  private setNextCallbackTime = (interval: number) => {
    this.nextCallbackTime = Date.now() + interval
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(this.callCallback, interval)
  }

  private callCallback = async () => {
    const now = Date.now()
    if (now < this.nextCallbackTime) {
      this.setNextCallbackTime(this.nextCallbackTime - now)
    } else {
      if (this.callback) await this.callback()
      this.setNextCallbackTime(this.interval)
    }
  }
}
