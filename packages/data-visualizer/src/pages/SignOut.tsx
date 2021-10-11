import { FunctionalComponent } from 'preact'
import { useContext, useEffect } from 'preact/hooks'
import { route } from 'preact-router'

import { UserContext } from '../contexts/User/UserContext'
import { ROUTES } from '../router/Router'

const SignOut: FunctionalComponent = () => {
  const { userHandler } = useContext(UserContext)

  useEffect(() => {
    if (userHandler) userHandler.signOut()
    route(ROUTES.LOGIN, true)
  }, [userHandler])

  return null
}

export default SignOut
