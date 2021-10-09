import { FunctionalComponent } from 'preact'

import { CountryDoc } from '../../types/country-doc'
import { byteFormatter } from '../../utils/byteFormatter'
import { co2Formatter } from '../../utils/co2Formatter'

interface Props {
  usageDetails?: CountryDoc
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
      className="w-32 h-44 bg-white bg-opacity-70 fixed rounded-sm pt-1 px-2"
      style={{ left: left - 20, top: top - 200 }}>
      <div className="text-primary">{usageDetails.countryName}</div>
      <div className="text-black">{co2Formatter(usageDetails.CO2)} CO2</div>
      <div className="text-black">{byteFormatter(usageDetails.size)}</div>
      <div className="text-black">
        {usageDetails.KWH?.toFixed(2) || '0.00'} KWH
      </div>
    </div>
  ) : null
}

export default CountryLabel
