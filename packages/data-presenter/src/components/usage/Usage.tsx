import { FunctionalComponent } from 'preact'
import { useContext } from 'preact/hooks'
import { UsageContext } from '../../contexts/UsageContext'
import OwnUsageChart from './OwnUsageChart'

import UsageDisplay from './UsageDisplay'

const Usage: FunctionalComponent = () => {
  const { todaysUsage, totalUsage, extendedPollution } =
    useContext(UsageContext)
  return (
    <div>
      <UsageDisplay
        todaysUsage={todaysUsage}
        totalUsage={totalUsage}
        showProductionPollution={extendedPollution}
      />
      <OwnUsageChart />
    </div>
  )
}

export default Usage
