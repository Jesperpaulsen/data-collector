import geoip from 'geoip-country'

class Country {
  getCountry = (ip?: string) => {
    try {
      if (!ip) return undefined
      const country = this.lookUp(ip)
      return country
    } catch (e) {
      console.log(e)
      return ''
    }
  }

  private lookUp = (ip: string) => {
    const countryInfo = geoip.lookup(ip)
    return countryInfo?.country || undefined
  }
}

export default new Country()
