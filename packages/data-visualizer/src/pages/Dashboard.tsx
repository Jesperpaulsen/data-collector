import { FunctionComponent } from 'preact'
import { useContext } from 'preact/hooks'

import Greeting from '../components/dashboard/Greeting'
import { UserContext } from '../contexts/User/UserContext'

const Dashboard: FunctionComponent = () => {
  const { userState } = useContext(UserContext)

  return (
    <div>
      <Greeting name={userState.currentUser?.name} />
    </div>
  )
}

export default Dashboard
