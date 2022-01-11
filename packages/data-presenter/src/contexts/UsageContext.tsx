import { createContext, FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import User from '../types/User'
import { MESSAGE_TYPES } from '../types/MESSAGE_TYPES'
import { UsageDetails } from '../types/UsageDetails'
import { UsageReport } from '../types/UsageReport'
import { Tip } from '../types/tip'

interface UsageContextProps {
  todaysUsage: UsageDetails
  totalUsage: UsageDetails
  usageLastWeek: {
    [date: number]: UsageDetails
  }
  reports: UsageReport[]
  tips: Tip[]
  extendedPollution: boolean
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
  reports: [],
  tips: [],
  extendedPollution: false
})

const UsageProvider: FunctionComponent = ({ children }) => {
  const [todaysUsage, setTodaysUsage] = useState(initialUsage)
  const [totalUsage, setTotalUsage] = useState(initialUsage)
  const [usageLastWeek, setUsageLastWeek] = useState<{
    [date: number]: UsageDetails
  }>({})
  const [reports, setReports] = useState<UsageReport[]>([])
  const [tips, setTips] = useState<Tip[]>([])
  const [extendedPollution, setExtendedPollution] = useState(false)

  const parseMessage = (details: any) => {
    if (!details?.payload) return
    const { type } = details
    if (type === MESSAGE_TYPES.SYNC_REQUESTS) {
      const { todaysUsage, totalUsage, ownUsageLastWeek } = details.payload
      setTotalUsage(totalUsage)
      setTodaysUsage(todaysUsage)
      setUsageLastWeek(ownUsageLastWeek)
    } else if (type === MESSAGE_TYPES.SEND_REPORTS) {
      const { reports } = details.payload
      setReports(reports)
    } else if (type === MESSAGE_TYPES.SEND_TIPS) {
      const { tips } = details.payload
      setTips(tips)
    } else if (type === MESSAGE_TYPES.SEND_EXTENDED_POLLUTION) {
      const { extendedPollution } = details.payload
      setExtendedPollution(extendedPollution)
    }
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(parseMessage)

    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.REQUEST_USAGE })

    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.REQUEST_REPORTS })

    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.REQUEST_TIPS })

    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.REQUEST_EXTENDED_POLLUTION
    })
  }, [])

  return (
    <UsageContext.Provider
      value={{
        todaysUsage,
        totalUsage,
        usageLastWeek,
        reports,
        tips,
        extendedPollution
      }}
      children={children}>
      {children}
    </UsageContext.Provider>
  )
}

export default UsageProvider
