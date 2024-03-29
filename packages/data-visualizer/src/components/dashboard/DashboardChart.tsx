import { createRef, FunctionalComponent } from 'preact'
import { useContext, useEffect, useMemo } from 'preact/hooks'

import { UsageContext } from '../../contexts/Usage/UsageContext'
import { UsageHandler } from '../../contexts/Usage/UsageHandler'
import { Dataset, Labels } from '../../types/chart-types'
import { getStartOfDateInUnix } from '../../utils/date'
import Button from '../common/Button'
import CustomChart from '../common/Charts/CustomChart'

const DashboardChart: FunctionalComponent = () => {
  const { usageState, usageHandler } = useContext(UsageContext)

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
    const res: Dataset = { label: '', data: { 0: 0 } }
    const data: { [date: number]: number } = {}
    if (!usageState.ownUsageLastWeek) return res

    for (const [date, usage] of Object.entries(usageState.ownUsageLastWeek)) {
      data[date] = usage.CO2
    }
    res.label = 'Your usage'
    res.data = data
    return res
  }, [usageState.ownUsageLastWeek])

  return useMemo(() => {
    return (
      <div className="flex justify-center">
        <div className="w-2/3">
          <CustomChart type={'line'} labels={labels} datasets={[ownUsage]} />
        </div>
      </div>
    )
  }, [labels, ownUsage])
}

export default DashboardChart
