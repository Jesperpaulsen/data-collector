import geoip from 'geoip-country'

import { CO2PerkWhCountry } from '@data-collector/types'
const co2PerkWh = require('../data/co2PerKwhPerCountry.json') as {
  [countryISO: string]: CO2PerkWhCountry
}

const valuesArray = Object.values(co2PerkWh)
const total = valuesArray.reduce(
  (prevValue, country) => (prevValue += country.CO2perkWh),
  0
)
const length = valuesArray.length

const average = total / length

const kwhPerGB = 0.09
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
    if (!size) return { CO2: 0, kWh: 0 }
    const infoAboutCountry = co2PerkWh[countryCode]
    const gCO2perkWh = (infoAboutCountry?.CO2perkWh || average) * 1000
    const kWh = size * kwhPerByte
    return { CO2: kWh * gCO2perkWh, kWh }
  }
}

export default new Country()
