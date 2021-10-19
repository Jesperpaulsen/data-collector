import { FunctionComponent } from 'preact'
import { useContext, useMemo, useState } from 'preact/hooks'
import { UserContext } from '../../contexts/UserContext'
import UsageDisplay from './UsageDisplay'
import Greeting from '../layout/Greeting'
import Button from '../common/Button'
import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES'

const Dashboard: FunctionComponent = () => {
  const resetCounter = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.REQUEST_RESET_COUNTER })
  }

  return (
    <div className="w-full h-screen">
      <div className="w-full">
        <UsageDisplay />
        <div className="flex justify-center pt-2">
          <Button onClick={resetCounter}>Reset counter</Button>
        </div>
        <div className="flex justify-center pt-2">
          <Button
            onClick={() =>
              window.open('https://dashboard.jesper.no', '_blank')
            }>
            Explore results
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
