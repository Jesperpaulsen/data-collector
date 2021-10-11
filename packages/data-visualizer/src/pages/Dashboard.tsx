import { FunctionComponent } from 'preact'
import { useContext } from 'preact/hooks'

import DashboardChart from '../components/dashboard/DashboardChart'
import UsageDisplay from '../components/dashboard/UsageDisplay'
import Greeting from '../components/layout/Greeting'
import { UserContext } from '../contexts/User/UserContext'

const Dashboard: FunctionComponent = () => {
  const { userState } = useContext(UserContext)

  return (
    <div>
      <UsageDisplay />
      <DashboardChart />
    </div>
  )
}

export default Dashboard
