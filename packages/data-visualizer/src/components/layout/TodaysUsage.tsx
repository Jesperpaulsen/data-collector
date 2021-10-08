import { FunctionComponent } from "preact";
import { UsageDetails } from "../../contexts/Usage/UsageState";
import { byteFormatter } from "../../utils/byteFormatter";
import { co2Formatter } from "../../utils/co2Formatter";

interface Props {
  todaysUsage: UsageDetails
}

const TodaysUsage: FunctionComponent<Props> = ({ todaysUsage }) => {
  return (
    <div className="flex justify-around items-center">
      <div className="text-xs">
        Todays Usage
      </div>
      <div className="px-2">
        {byteFormatter(todaysUsage.size)}
      </div>
      <div className="px-2">
        {(todaysUsage.KWH).toFixed(2)} KWH
      </div>
      <div className="px-2">
        {co2Formatter(todaysUsage.CO2)} CO2
      </div>
    </div>
  )
}

export default TodaysUsage