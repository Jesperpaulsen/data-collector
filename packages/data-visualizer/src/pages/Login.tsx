import { FunctionComponent } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

import Button from '../components/common/Button'
import { UserContext } from '../contexts/User/UserContext'

const Login: FunctionComponent = () => {
  const { userHandler } = useContext(UserContext)

  return (
    <div className="w-full">
      <div className="text-6xl text-center pt-6">Data Collector</div>
      <div className="flex justify-center pt-14">
        <Button onClick={() => userHandler?.signIn()}>
          Log In With Google
        </Button>
      </div>
    </div>
  )
}

export default Login
