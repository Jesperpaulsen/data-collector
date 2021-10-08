import { createContext, FunctionComponent } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import User from '../../types/User';
import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES'
import { initialState, UsageState } from './UsageState';
import { UserContext } from '../User/UserContext';
import { UsageHandler } from './UsageHandler';

interface UsageContextProps {
  usageState: UsageState,
  usageHandler?: UsageHandler 
}


export const UsageContext = createContext<UsageContextProps>({ usageState: initialState });

const UsageProvider: FunctionComponent = ({ children }) => {
  const [usageState, setUsageState] = useState<UsageState>(initialState)
  const [usageHandler, setUsageHandler] = useState<UsageHandler | undefined>(undefined)
  const { userState } = useContext(UserContext)

  useEffect(() => {
    if (!usageHandler) setUsageHandler(new UsageHandler(usageState, setUsageState))
  }, [])

  useEffect(() => {
    if (userState) usageHandler?.setState({ userState })
  }, [userState])


  return <UsageContext.Provider value={{ usageState, usageHandler }}>{children}</UsageContext.Provider>;
};

export default UsageProvider;
