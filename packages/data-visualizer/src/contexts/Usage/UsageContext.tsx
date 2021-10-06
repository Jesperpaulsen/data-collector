import { createContext, FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import User from '../../types/User';
import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES'

interface UsageContextProps {
  usage: {
    usageToday: number
    usageLast7Days: number
    totalUsage: number
  },
  totalCO2: number
}

const initialUsage = {
  usageToday: 0, usageLast7Days: 0, totalUsage: 0
}

export const UsageContext = createContext<UsageContextProps>({ usage: initialUsage, totalCO2: 0 });

const UsageProvider: FunctionComponent = ({ children }) => {
  const [usage, setUsage] = useState(initialUsage)
  const [totalCO2, setTotalCO2] = useState(0)

  return <UsageContext.Provider value={{ usage, totalCO2 }}>{children}</UsageContext.Provider>;
};

export default UsageProvider;