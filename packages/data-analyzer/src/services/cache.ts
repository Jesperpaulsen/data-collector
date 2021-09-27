export class Cache<T> {
  private cacheLimit = 0
  private cache = new Map<string, T>()

  constructor(cacheLimit: number) {
    this.cacheLimit = cacheLimit
  }

  get = (key: string) => {
    const object = this.cache.get(key)

    if (!object) return undefined

    this.cache.delete(key)
    this.cache.set(key, object)
    return object
  }

  put = (key: string, object: T) => {
    this.cache.delete(key)

    if (this.cache.size === this.cacheLimit) {
      this.cache.delete(this.cache.keys().next().value)
    }
    this.cache.set(key, object)
  }
}
