import { createContext, FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import User from '../types/User'
import { MESSAGE_TYPES } from '../types/MESSAGE_TYPES'
import { UsageDetails } from '../types/UsageDetails'

interface UsageContextProps {
  todaysUsage: UsageDetails
  totalUsage: UsageDetails
  usageLastWeek: {
    [date: number]: UsageDetails
  }
}

const initialUsage: UsageDetails = {
  CO2: 0,
  kWh: 0,
  size: 0
}

export const UsageContext = createContext<UsageContextProps>({
  todaysUsage: initialUsage,
  totalUsage: initialUsage,
  usageLastWeek: {}
})

const UsageProvider: FunctionComponent = ({ children }) => {
  const [todaysUsage, setTodaysUsage] = useState(initialUsage)
  const [totalUsage, setTotalUsage] = useState(initialUsage)
  const [usageLastWeek, setUsageLastWeek] = useState<{
    [date: number]: UsageDetails
  }>({})

  const parseMessage = (details: any) => {
    const { type } = details
    if (type === MESSAGE_TYPES.SYNC_REQUESTS) {
      const { todaysUsage, totalUsage, ownUsageLastWeek } = details.payload
      setTotalUsage(totalUsage)
      setTodaysUsage(todaysUsage)
      setUsageLastWeek(ownUsageLastWeek)
    }
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(parseMessage)

    chrome.runtime.sendMessage(
      { type: MESSAGE_TYPES.REQUEST_USAGE },
      parseMessage
    )
  }, [])

  return (
    <UsageContext.Provider
      value={{ todaysUsage, totalUsage, usageLastWeek }}
      children={children}>
      {children}
    </UsageContext.Provider>
  )
}

export default UsageProvider
