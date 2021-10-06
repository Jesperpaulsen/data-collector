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
  LOGIN = '/login'
} 

const routeComponents: {[route in ROUTES]: { requireAuth?: boolean, component: FunctionComponent }} = {
  [ROUTES.DASHBOARD]: { requireAuth: true, component: Dashboard },
  [ROUTES.LOGIN]: { component: Login }
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
