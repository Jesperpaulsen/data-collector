import { FunctionComponent } from 'preact'
import { useContext, useState } from 'preact/hooks'
import { UserContext } from '../../contexts/UserContext'
import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES'
import Button from '../common/Button'

const Login: FunctionComponent = () => {
  const login = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SIGN_IN })
  }

  return (
    <div className="w-full">
      <div className="text-6xl text-center pt-6">Data Collector</div>
      <div className="flex justify-center pt-14">
        <Button onClick={login}>Log In With Google</Button>
      </div>
    </div>
  )
}

export default Login
