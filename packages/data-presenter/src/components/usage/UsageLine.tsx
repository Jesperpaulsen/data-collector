import { Fragment, FunctionalComponent } from 'preact'
import { useMemo } from 'preact/hooks'

import { UsageDetails } from '../../types/UsageDetails'
import { byteFormatter } from '../../utils/byteFormatter'
import { co2Formatter } from '../../utils/co2Formatter'
import { convertActiveSecondsToPollution } from '../../utils/convertActiveSecondsToPollution'
import { kmFormatter } from '../../utils/kmFormatter'
import Hover from '../common/Hover'

import car from './car.svg'
import electricCar from './electric-car.svg'

// TODO: Correct model3 number
const averageCO2PerPetrolCarPerM = 0.1234
const model3kWhPerM = 0.000149

interface Props {
  usage: UsageDetails
  label: string
  showProductionPollution: boolean
}

const UsageLine: FunctionalComponent<Props> = ({
  usage,
  label,
  showProductionPollution
}) => {
  const { kWh, CO2 } = convertActiveSecondsToPollution(usage.secondsActive || 1)

  const kwhToPresent = useMemo(() => {
    return showProductionPollution ? usage.kWh + kWh : usage.kWh
  }, [showProductionPollution, usage, kWh])

  const co2ToPresent = useMemo(() => {
    return showProductionPollution ? usage.CO2 + CO2 : usage.CO2
  }, [showProductionPollution, usage, CO2])

  return (
    <Fragment>
      <div className="text-center">{label}</div>
      <div className="flex justify-center">
        <div className="text-center px-6">
          <div className="text-2xl font-medium text-green-800">
            {byteFormatter(usage.size)}
          </div>
        </div>
        <div className="text-center px-6">
          <div className="text-2xl font-medium text-green-800">
            {usage.kWh?.toFixed(2)} kWh
          </div>
        </div>
        <div className="text-center px-6">
          <div className="text-2xl font-medium text-green-800">
            {co2Formatter(co2ToPresent)} CO<sub>2</sub>
          </div>
        </div>
      </div>
      <div className="flex justify-center text-lg pt-2">
        <div className="pr-2">{kmFormatter(usage.kWh / model3kWhPerM)}</div>
        <div className="pr-2">
          <Hover infoText="The distance you would have been able to drive a Tesla Model 3 based on the amount of energy you have used.">
            <div className="rounded-full flex justify-center items-end w-6 h-6">
              <img src={electricCar} alt="Icon of electric car" />
            </div>
          </Hover>
        </div>
        <div className="pl-1">
          {kmFormatter(co2ToPresent / averageCO2PerPetrolCarPerM)}
        </div>
        <div className="pl-1">
          <Hover
            left
            infoText="The distance you would have been able to drive a petrol car based on the amount of CO2 you have polluted.">
            <div className="rounded-full flex justify-center items-end w-6 h-6">
              <img src={car} alt="Icon of petrol car" />
            </div>
          </Hover>
        </div>
      </div>
    </Fragment>
  )
}

export default UsageLine
