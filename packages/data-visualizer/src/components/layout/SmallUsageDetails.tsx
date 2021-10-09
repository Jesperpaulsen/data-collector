import { FunctionComponent } from 'preact'

import { UsageDetails } from '../../contexts/Usage/UsageState'
import { byteFormatter } from '../../utils/byteFormatter'
import { co2Formatter } from '../../utils/co2Formatter'

interface Props {
  usageDetails: UsageDetails
  label
}

const SmallUsageDetails: FunctionComponent<Props> = ({
  usageDetails,
  label
}) => {
  return (
    <div className="flex justify-around items-center">
      <div className="text-xs">{label}</div>
      <div className="px-2">{byteFormatter(usageDetails.size)}</div>
      <div className="px-2">{usageDetails.KWH.toFixed(2)} KWH</div>
      <div className="px-2">{co2Formatter(usageDetails.CO2)} CO2</div>
    </div>
  )
}

export default SmallUsageDetails
