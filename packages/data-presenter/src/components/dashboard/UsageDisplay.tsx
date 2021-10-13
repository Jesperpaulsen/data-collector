import { FunctionalComponent } from 'preact'
import { useContext, useMemo, useState } from 'preact/hooks'
import { UsageContext } from '../../contexts/UsageContext'
import { UsageDetails } from '../../types/UsageDetails'

import { byteFormatter } from '../../utils/byteFormatter'
import { co2Formatter } from '../../utils/co2Formatter'

const UsageLine: FunctionalComponent<{ usage: UsageDetails; label: string }> =
  ({ usage, label }) => {
    return (
      <div className="pt-5">
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
        <div className="text-center">{label}</div>
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
