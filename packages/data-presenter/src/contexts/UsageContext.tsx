import { createContext, FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import User from '../types/User';
import { MESSAGE_TYPES } from '../types/MESSAGE_TYPES'
import { UsageDetails } from '../types/UsageDetails';

interface UsageContextProps {
  todaysUsage: UsageDetails
  totalUsage: UsageDetails
}

const initialUsage: UsageDetails = {
  CO2: 0,
  KWH: 0,
  size: 0
}

export const UsageContext = createContext<UsageContextProps>({ todaysUsage: initialUsage, totalUsage: initialUsage });

const UsageProvider: FunctionComponent = ({ children }) => {
  const [todaysUsage, setTodaysUsage] = useState(initialUsage)
  const [totalUsage, setTotalUsage] = useState(initialUsage)

  const parseMessage = (details: any) => {
    const { type } = details
      if (type === MESSAGE_TYPES.SYNC_REQUESTS) {
        const { todaysUsage, totalUsage } = details.payload
        setTotalUsage(totalUsage)
        setTodaysUsage(todaysUsage)
      }
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(parseMessage)

    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.REQUEST_USAGE }, parseMessage)
  }, [])

  return <UsageContext.Provider value={{ todaysUsage, totalUsage }}>{children}</UsageContext.Provider>;
};

export default UsageProvider;
