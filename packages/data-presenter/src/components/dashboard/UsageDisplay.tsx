import { FunctionalComponent } from 'preact'
import { useContext, useMemo, useState } from 'preact/hooks'
import { UsageContext } from '../../contexts/UsageContext'
import { UsageDetails } from '../../types/UsageDetails'

import { byteFormatter } from '../../utils/byteFormatter'
import { co2Formatter } from '../../utils/co2Formatter'

import car from './car.svg'
import electricCar from './electric-car.svg'

const averageCO2PerPetrolCarPerKm = 123.4
const model3KWHPerKm = 0.149

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
              {usage.KWH.toFixed(2)} KWH
            </div>
          </div>
          <div className="text-center px-6">
            <div className="text-4xl font-medium">
              {co2Formatter(usage.CO2)} CO2
            </div>
          </div>
        </div>
        <div className="flex justify-center text-lg pt-2">
          <div className="pr-1">
            <img src={electricCar} className="w-6 h-6" />
          </div>
          <div className="pr-2">
            {(usage.KWH / model3KWHPerKm).toFixed(2)} km
            <sup>*</sup>
          </div>
          <div className="pl-2">
            <img src={car} className="w-6 h-6" />
          </div>
          <div className="pl-1">
            {(usage.CO2 / averageCO2PerPetrolCarPerKm).toFixed(2)} km
            <sup>**</sup>{' '}
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
      <div className="text-center pt-4 text-sm">
        <sup>*</sup>
        The distance you would have been able to drive a Tesla Model 3 with the
        same amount of energy that you have used.
      </div>
      <div className="text-center text-sm">
        <sup>**</sup>
        The distance you would have been able to drive an average petrol car to
        equalize the amount of CO2 you have polluted.
      </div>
    </div>
  )
}

export default UsageDisplay
