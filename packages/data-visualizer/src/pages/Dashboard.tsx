import { FunctionComponent } from 'preact'
import { useContext } from 'preact/hooks'
import UsageDisplay from '../components/dashboard/UsageDisplay'

import Greeting from '../components/layout/Greeting'
import { UserContext } from '../contexts/User/UserContext'

const Dashboard: FunctionComponent = () => {
  const { userState } = useContext(UserContext)

  return (
    <div>
      <UsageDisplay />
    </div>
  )
}

export default Dashboard
