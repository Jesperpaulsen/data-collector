import { createContext, FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import User from '../types/User'
import { MESSAGE_TYPES } from '../types/MESSAGE_TYPES'
import { UsageDetails } from '../types/UsageDetails'
import { UsageReport } from '../types/UsageReport'

interface UsageContextProps {
  todaysUsage: UsageDetails
  totalUsage: UsageDetails
  usageLastWeek: {
    [date: number]: UsageDetails
  }
  reports: UsageReport[]
}

const initialUsage: UsageDetails = {
  CO2: 0,
  kWh: 0,
  size: 0,
  secondsActive: 0
}

export const UsageContext = createContext<UsageContextProps>({
  todaysUsage: initialUsage,
  totalUsage: initialUsage,
  usageLastWeek: {},
  reports: []
})

const UsageProvider: FunctionComponent = ({ children }) => {
  const [todaysUsage, setTodaysUsage] = useState(initialUsage)
  const [totalUsage, setTotalUsage] = useState(initialUsage)
  const [usageLastWeek, setUsageLastWeek] = useState<{
    [date: number]: UsageDetails
  }>({})
  const [reports, setReports] = useState<UsageReport[]>([])

  const parseMessage = (details: any) => {
    if (!details?.payload) return
    const { type } = details
    if (type === MESSAGE_TYPES.SYNC_REQUESTS) {
      console.log(details.payload)
      const { todaysUsage, totalUsage, ownUsageLastWeek } = details.payload
      setTotalUsage(totalUsage)
      setTodaysUsage(todaysUsage)
      setUsageLastWeek(ownUsageLastWeek)
    } else if (type === MESSAGE_TYPES.SEND_REPORTS) {
      const { reports } = details.payload
      setReports(reports)
    }
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(parseMessage)

    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.REQUEST_USAGE })

    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.REQUEST_REPORTS })
  }, [])

  return (
    <UsageContext.Provider
      value={{ todaysUsage, totalUsage, usageLastWeek, reports }}
      children={children}>
      {children}
    </UsageContext.Provider>
  )
}

export default UsageProvider
