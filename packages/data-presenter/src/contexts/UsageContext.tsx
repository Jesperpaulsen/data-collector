import { createContext, FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import User from '../types/User';
import { MESSAGE_TYPES } from '../types/MESSAGE_TYPES'

interface UsageContextProps {
  usage: {
    usageToday: number
    usageLast7Days: number
    totalUsage: number
  }
}

const initialUsage = {
  usageToday: 0, usageLast7Days: 0, totalUsage: 0
}

export const UsageContext = createContext<UsageContextProps>({ usage: initialUsage });

const UsageProvider: FunctionComponent = ({ children }) => {
  const [usage, setUsage] = useState(initialUsage)

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (details) {
      const { type } = details
      if (type === MESSAGE_TYPES.SYNC_REQUESTS) {
        setUsage(details.payload)
      }
    })

    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.REQUEST_USAGE })
  }, [])

  return <UsageContext.Provider value={{ usage }}>{children}</UsageContext.Provider>;
};

export default UsageProvider;
