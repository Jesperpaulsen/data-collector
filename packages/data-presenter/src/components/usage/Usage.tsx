import { FunctionalComponent } from 'preact'
import { useContext } from 'preact/hooks'
import { UsageContext } from '../../contexts/UsageContext'
import OwnUsageChart from './OwnUsageChart'

import UsageDisplay from './UsageDisplay'

const Usage: FunctionalComponent = () => {
  const { todaysUsage, totalUsage } = useContext(UsageContext)
  return (
    <div>
      <UsageDisplay todaysUsage={todaysUsage} totalUsage={totalUsage} />
      <OwnUsageChart />
    </div>
  )
}

export default Usage
