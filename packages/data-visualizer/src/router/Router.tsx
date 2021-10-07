import { FunctionComponent } from 'preact'
import { Route, route, Router as PreactRouter } from 'preact-router'
import { useContext, useEffect } from 'preact/hooks'

import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import { UserContext } from '../contexts/User/UserContext'
import ProtectedRoute from './ProtectedRoute'
import Redirect from '../components/common/Redirect'

export enum ROUTES {
  DASHBOARD = '/',
  LOGIN = '/login',
  USAGE_BY_COUNTRY = '/usage-by-country',
  USAGE_BY_HOST = '/usage-by-host',
  STATISTICS = '/statistics',
  ABOUT = '/about'
} 

export const routeComponents: {[route in ROUTES]: { requireAuth?: boolean, component: FunctionComponent, label?: string }} = {
  [ROUTES.DASHBOARD]: { requireAuth: true, component: Dashboard, label: 'Dashboard' },
  [ROUTES.LOGIN]: { component: Login },
  [ROUTES.USAGE_BY_COUNTRY]: { requireAuth: true, label: 'Usage By Country', component: () => <div>Usage By Country</div> },
  [ROUTES.USAGE_BY_HOST]: { requireAuth: true, label: 'Usage By Host', component: () => <div>Usage By Host</div> },
  [ROUTES.STATISTICS]: { requireAuth: true, label: 'Statistics', component: () => <div>Statistics</div> },
  [ROUTES.ABOUT]: { requireAuth: true, label: 'About', component: () => <div>About</div> },
}

const initialRoute = window.location.pathname

const Router: FunctionComponent = () => {
  const { userState, userHandler } = useContext(UserContext)


  useEffect(() => {
    if (userState.currentUser) {
      const routeTo = initialRoute === ROUTES.LOGIN ? ROUTES.DASHBOARD : initialRoute;
      route(routeTo, true)
    }
  }, [userState])

  return <PreactRouter>
    {Object.entries(routeComponents).map(([key, value]) => (
      value.requireAuth ? 
        <ProtectedRoute children={value.component} path={key} redirect={ROUTES.LOGIN} /> 
        : 
        <Route component={value.component} path={key} />
    ))}
  </PreactRouter>
}

export default Router
