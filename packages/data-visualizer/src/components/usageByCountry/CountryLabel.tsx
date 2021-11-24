import { FunctionalComponent } from 'preact'

import { CountryDoc } from '../../types/country-doc'
import { HostToCountry } from '../../types/host-to-country'
import { byteFormatter } from '../../utils/byteFormatter'
import { co2Formatter } from '../../utils/co2Formatter'

interface Props {
  usageDetails?: CountryDoc | HostToCountry
  left: number
  top: number
}

const CountryLabel: FunctionalComponent<Props> = ({
  usageDetails,
  left,
  top
}) => {
  return usageDetails ? (
    <div
      className="bg-gray-100 fixed rounded-lg p-5 z-10 shadow-lg"
      style={{ left: left - 20, top: top - 190 }}>
      <div className="text-primary">{usageDetails.countryName}</div>
      <div className="text-black">{co2Formatter(usageDetails.CO2)} CO2</div>
      <div className="text-black">{byteFormatter(usageDetails.size)}</div>
      <div className="text-black">
        {usageDetails.kWh?.toFixed(2) || '0.00'} kWh
      </div>
      <div className="text-black">{usageDetails.numberOfCalls} Requests</div>
      <div className="text-sm text-gray-600">Click to see details</div>
    </div>
  ) : null
}

export default CountryLabel
