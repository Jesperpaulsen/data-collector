import { createContext, FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import User from '../types/User';
import { MESSAGE_TYPES } from '../types/MESSAGE_TYPES'

interface UserContextProps {
  currentUser?: User;
  setCurrentUser: (user: User) => void
}

export const UserContext = createContext<UserContextProps>({ setCurrentUser: (user: User) => null });

const UserProvider: FunctionComponent = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (details) {
      const { type } = details
      if (type === MESSAGE_TYPES.SEND_USER) {
        setCurrentUser(details.payload)
      }
    })

    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.REQUEST_USER })
  }, [])

  return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
