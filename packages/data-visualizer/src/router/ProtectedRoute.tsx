import { FunctionComponent } from 'preact'
import { useContext } from 'preact/hooks'
import Router, { Route, route } from 'preact-router'

import Redirect from '../components/common/Redirect'
import { UserContext } from '../contexts/User/UserContext'
import Login from '../pages/Login'

import Layout from './Layout'
import { ROUTES } from './Router'

interface Props {
  path: string
  redirect: string
  children: FunctionComponent
  exact?: boolean
}

const ProtectedRoute: FunctionComponent<Props> = ({
  path,
  children,
  redirect
}) => {
  const { userState } = useContext(UserContext)

  if (!userState.currentUser) {
    return <Redirect to={redirect} />
  }

  return (
    <Layout>
      <Route component={children} path={path} />
    </Layout>
  )
}

export default ProtectedRoute
