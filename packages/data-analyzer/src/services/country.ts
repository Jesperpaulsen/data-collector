import geoip from 'geoip-country'

class Country {
  getCountry = (ip?: string) => {
    try {
      if (!ip) return ''
      const country = this.lookUp(ip)
      return country || ''
    } catch (e) {
      console.log(e)
      return ''
    }
  }

  private lookUp = (ip: string) => {
    const countryInfo = geoip.lookup(ip)
    return countryInfo?.country || undefined
  }

  // TODO: Create estimation
  calculateEmission = (country?: string) => {
    if (!country) return 0
    return 0
  }
}

export default new Country()
