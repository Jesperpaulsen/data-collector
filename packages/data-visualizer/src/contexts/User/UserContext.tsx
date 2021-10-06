import { createContext, FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import User from '../../types/User';
import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES'
import { UserHandler } from './UserHandler';
import { initialUserState, UserState } from './UserState';

interface UserContextProps {
  userState: UserState
  userHandler?: UserHandler
}

export const UserContext = createContext<UserContextProps>({ userState: initialUserState });

const UserProvider: FunctionComponent = ({ children }) => {
  const [userState, setUserState] = useState<UserState>(initialUserState);
  const [userHandler, setUserHandler] = useState<UserHandler | undefined>(undefined)

  useEffect(() => {
    if (!userHandler) setUserHandler(new UserHandler(initialUserState, setUserState))    
  }, [])


  return <UserContext.Provider value={{ userHandler, userState }}>{children}</UserContext.Provider>;
};

export default UserProvider;
