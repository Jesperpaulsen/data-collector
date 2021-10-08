import geoip from 'geoip-country'

import { CO2PerKWHCountry } from '@data-collector/types'
const co2PerKWH = require('../data/co2PerKwhPerCountry.json') as {
  [countryISO: string]: CO2PerKWHCountry
}

const valuesArray = Object.values(co2PerKWH)
const total = valuesArray.reduce(
  (prevValue, country) => (prevValue += country.CO2perKWH),
  0
)
const length = valuesArray.length

const average = total / length

const kwhPerGB = 1.8
const kwhPerByte = kwhPerGB / (1024 * 1024 * 1024)

class Country {
  // @ts-ignore
  private regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

  getCountry = (ip?: string) => {
    const res = { countryCode: '', countryName: '' }
    try {
      if (!ip) return res
      res.countryCode = this.lookUp(ip) || ''
      res.countryName = this.regionNames.of(res.countryCode)
      return res
    } catch (e) {
      console.log(e)
      return res
    }
  }

  private lookUp = (ip: string) => {
    const countryInfo = geoip.lookup(ip)
    return countryInfo?.country || undefined
  }

  calculateEmission = ({
    size,
    countryCode = ''
  }: {
    size?: number | null
    countryCode?: string
  }) => {
    if (!size) return { CO2: 0, KWH: 0 }
    const infoAboutCountry = co2PerKWH[countryCode]
    const gCO2perKWH = (infoAboutCountry?.CO2perKWH || average) * 1000
    const KWH = size * kwhPerByte
    return { CO2: KWH * gCO2perKWH, KWH }
  }
}

export default new Country()
