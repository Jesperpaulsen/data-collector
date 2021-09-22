import { createContext, FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import User from '../types/User';

interface UserContextProps {
  currentUser?: User;
  setCurrentUser: (user: User) => void
}

export const UserContext = createContext<UserContextProps>({});

const UserProvider: FunctionComponent = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
