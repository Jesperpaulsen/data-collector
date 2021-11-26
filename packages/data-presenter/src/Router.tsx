import { FunctionalComponent } from 'preact'
import { useContext, useState } from 'preact/hooks'

import Dashboard from './components/dashboard/Dashboard'
import Layout from './components/Layout'
import Login from './components/login/Login'
import Reports from './components/reports/Reports'
import Settings from './components/settings/Settings'
import Statistics from './components/statistics/Statistics'
import Usage from './components/usage/Usage'
import { UserContext } from './contexts/UserContext'
import { SHOW_USAGE } from './config'

export const Routes: {
  [key: string]: {
    label: string
    component: FunctionalComponent
    externalURL?: string
  }
} = {
  dashboard: {
    label: 'Dashboard',
    component: Dashboard
  },
  usage: {
    label: 'Usage',
    component: () => null,
    externalURL: 'https://dashboard.jesper.no'
  },
  statistics: {
    label: 'Statistics',
    component: Usage
  },
  reports: {
    label: 'Reports',
    component: Reports
  },
  settings: {
    label: SHOW_USAGE ? 'Settings' : 'Blacklisted Domains',
    component: Settings
  }
}

const Router: FunctionalComponent = () => {
  const { currentUser } = useContext(UserContext)
  const [currentRoute, setCurrentRoute] = useState(Routes.dashboard)

  const handleRouteClick = (routePath: string) => {
    const route = Routes[routePath]
    if (route.externalURL) {
      window.open('https://dashboard.jesper.no', '_blank')
      return
    }
    setCurrentRoute(route)
  }

  return currentUser ? (
    <Layout
      routes={Object.entries(Routes).map(([key, value]) => ({
        key,
        label: value.label,
        externalURL: !!value.externalURL
      }))}
      activeRoute={currentRoute.label}
      onClick={handleRouteClick}>
      <currentRoute.component />
    </Layout>
  ) : (
    <Login />
  )
}

export default Router
