import { h, createContext, FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import User from '../types/User';

interface UserContextProps {
  currentUser?: User;
}

export const UserContext = createContext<UserContextProps>({});

const UserProvider: FunctionComponent = ({ children }) => {
  const [currentUser, setCUrrentUser] = useState<User | undefined>(undefined);

  return <UserContext.Provider value={{ currentUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
