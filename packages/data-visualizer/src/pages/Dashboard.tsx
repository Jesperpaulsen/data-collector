import { FunctionComponent } from 'preact'

import DashboardChart from '../components/dashboard/DashboardChart'
import UsageDisplay from '../components/dashboard/UsageDisplay'

const Dashboard: FunctionComponent = () => {
  return (
    <div>
      <UsageDisplay />
      <DashboardChart />
    </div>
  )
}

export default Dashboard
