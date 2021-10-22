import { FunctionalComponent } from 'preact'
import { useContext, useMemo, useState } from 'preact/hooks'
import { UsageContext } from '../../contexts/UsageContext'
import { UsageDetails } from '../../types/UsageDetails'

import { byteFormatter } from '../../utils/byteFormatter'
import { co2Formatter } from '../../utils/co2Formatter'
import Hover from '../common/Hover'

import car from './car.svg'
import electricCar from './electric-car.svg'

const averageCO2PerPetrolCarPerKm = 123.4
const model3kWhPerKm = 0.149

const UsageLine: FunctionalComponent<{ usage: UsageDetails; label: string }> =
  ({ usage, label }) => {
    return (
      <div className="pb-4">
        <div className="text-center">{label}</div>
        <div className="flex justify-center">
          <div className="text-center px-6">
            <div className="text-4xl font-medium">
              {byteFormatter(usage.size)}
            </div>
          </div>
          <div className="text-center px-6">
            <div className="text-4xl font-medium">
              {usage.kWh?.toFixed(2)} kWh
            </div>
          </div>
          <div className="text-center px-6">
            <div className="text-4xl font-medium">
              {co2Formatter(usage.CO2)} CO2
            </div>
          </div>
        </div>
        <div className="flex justify-center text-lg pt-2">
          <div className="pr-2">
            {(usage.kWh / model3kWhPerKm).toFixed(2)} km
          </div>
          <div className="pr-2">
            <Hover
              infoText="The distance you would have been able to drive a Tesla Model 3 with the
        same amount of energy that you have used.">
              <img src={electricCar} alt="Icon of electric car" />
            </Hover>
          </div>
          <div className="pl-1">
            {(usage.CO2 / averageCO2PerPetrolCarPerKm).toFixed(2)} km
          </div>
          <div className="pl-1">
            <Hover
              left
              infoText="The distance you would have been able to drive an average petrol car to
            equalize the amount of CO2 you have polluted.">
              <img src={car} alt="Icon of petrol car" />
            </Hover>
          </div>
        </div>
      </div>
    )
  }

const UsageDisplay: FunctionalComponent = () => {
  const { todaysUsage, totalUsage } = useContext(UsageContext)

  return (
    <div className="pt-2">
      <UsageLine usage={todaysUsage} label="Todays usage" />
      <UsageLine usage={totalUsage} label="Total usage" />
    </div>
  )
}

export default UsageDisplay
