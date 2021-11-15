export abstract class EnvInjecter {
  protected token?: string
  private tokenName: string

  constructor(tokenName: string) {
    this.tokenName = tokenName
  }

  injectToken() {
    const token = process.env[this.tokenName]
    this.token = token
  }
}
