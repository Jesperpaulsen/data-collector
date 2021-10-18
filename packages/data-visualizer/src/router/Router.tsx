import { FunctionComponent } from 'preact'
import { Route, route, Router as PreactRouter } from 'preact-router'
import { useContext, useEffect } from 'preact/hooks'

import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import { UserContext } from '../contexts/User/UserContext'
import ProtectedRoute from './ProtectedRoute'
import Redirect from '../components/common/Redirect'
import UsageByCountry from '../pages/UsageByCountry'
import UsageByHost from '../pages/UsageByHost'
import SignOut from '../pages/SignOut'
import { Statistics } from '../pages/Statistics'

export enum ROUTES {
  DASHBOARD = '/',
  LOGIN = '/login',
  USAGE_BY_COUNTRY = '/usage-by-country',
  USAGE_BY_HOST = '/usage-by-host',
  STATISTICS = '/statistics',
  ABOUT = '/about',
  SIGN_OUT = '/sign-out'
}

export const routeComponents: {
  [route in ROUTES]: {
    requireAuth?: boolean
    component: FunctionComponent
    label?: string
  }
} = {
  [ROUTES.DASHBOARD]: {
    requireAuth: true,
    component: Dashboard,
    label: 'Dashboard'
  },
  [ROUTES.LOGIN]: { component: Login },
  [ROUTES.USAGE_BY_COUNTRY]: {
    requireAuth: true,
    label: 'Usage By Country',
    component: UsageByCountry
  },
  [ROUTES.USAGE_BY_HOST]: {
    requireAuth: true,
    label: 'Usage By Host',
    component: UsageByHost
  },
  [ROUTES.STATISTICS]: {
    requireAuth: true,
    label: 'Statistics',
    component: Statistics
  },
  [ROUTES.ABOUT]: {
    requireAuth: true,
    label: 'About',
    component: () => {
      window.open('https://climate.jesper.no/about', '_blank')
      return null
    }
  },
  [ROUTES.SIGN_OUT]: {
    requireAuth: false,
    label: 'Sign Out',
    component: SignOut
  }
}

const initialRoute = window.location.pathname
const routeTo =
  initialRoute === ROUTES.LOGIN
    ? ROUTES.DASHBOARD
    : initialRoute === ROUTES.SIGN_OUT
    ? ROUTES.LOGIN
    : initialRoute

const Router: FunctionComponent = () => {
  const { userState } = useContext(UserContext)

  useEffect(() => {
    if (userState.currentUser) {
      route(routeTo, true)
    }
  }, [userState.currentUser])

  return (
    <PreactRouter>
      {Object.entries(routeComponents).map(([key, value]) =>
        value.requireAuth ? (
          <ProtectedRoute
            children={value.component}
            path={key}
            redirect={ROUTES.LOGIN}
          />
        ) : (
          <Route component={value.component} path={key} />
        )
      )}
      <Dashboard default />
    </PreactRouter>
  )
}

export default Router
