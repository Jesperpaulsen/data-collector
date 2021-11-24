import { createRef, FunctionalComponent } from 'preact'
import { useContext, useEffect, useMemo } from 'preact/hooks'

import { UsageContext } from '../../contexts/UsageContext'
import { Dataset, Labels } from '../../types/chart-types'
import { getStartOfDateInUnix } from '../../utils/date'
import Button from '../common/Button'
import CustomChart from '../common/Charts/CustomChart'

const OwnUsageChart: FunctionalComponent = () => {
  const { usageLastWeek } = useContext(UsageContext)

  const labels = useMemo(() => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]
    const goBackDays = 7

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const daysSorted: Labels = []

    for (let i = 0; i < goBackDays; i++) {
      const newDate = new Date(tomorrow.setDate(tomorrow.getDate() - 1))
      const value = getStartOfDateInUnix(newDate)
      const label = i === 0 ? 'Today' : days[newDate.getDay()]
      daysSorted.push({ value, label })
    }

    return daysSorted.reverse()
  }, [])

  const ownUsage = useMemo(() => {
    const res: Dataset[] = []
    const co2: { [date: number]: number } = {}
    const kWh: { [date: number]: number } = {}
    const data: { [date: number]: number } = {}
    if (!usageLastWeek) return res

    for (const [date, usage] of Object.entries(usageLastWeek)) {
      co2[date] = usage.CO2
      kWh[date] = usage.kWh
      // data[date] = usage.size
    }
    res.push({ label: 'CO2 (g)', data: co2 })
    res.push({ label: 'kWh', data: kWh })
    // res.push({ label: 'Data', data: data })
    return res
  }, [usageLastWeek])

  return useMemo(() => {
    return (
      <div className="flex justify-center">
        <div className="w-full">
          <CustomChart type={'line'} labels={labels} datasets={ownUsage} />
        </div>
      </div>
    )
  }, [labels, ownUsage])
}

export default OwnUsageChart
