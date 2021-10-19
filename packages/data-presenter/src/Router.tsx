import { FunctionComponent } from 'preact'
import { useContext, useState } from 'preact/hooks'
import Dashboard from './components/dashboard/Dashboard'
import Layout from './components/Layout'
import Login from './components/login/Login'
import Settings from './components/settings/Settings'
import Statistics from './components/statistics/Statistics'
import { UserContext } from './contexts/UserContext'

export const Routes = {
  dashboard: {
    label: 'Dashboard',
    component: Dashboard
  },
  statistics: {
    label: 'Statistics',
    component: Statistics
  },
  settings: {
    label: 'Settings',
    component: Settings
  }
}

const Router: FunctionComponent = () => {
  const { currentUser } = useContext(UserContext)
  const [currentRoute, setCurrentRoute] = useState(Routes.dashboard)
  return currentUser ? (
    <Layout
      routes={Object.entries(Routes).map(([key, value]) => ({
        key,
        label: value.label
      }))}
      onClick={(route) => setCurrentRoute(Routes[route])}>
      <currentRoute.component />
    </Layout>
  ) : (
    <Login />
  )
}

export default Router
