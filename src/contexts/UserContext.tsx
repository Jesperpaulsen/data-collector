import { createContext, FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import User from '../types/User';

interface UserContextProps {
  currentUser?: User;
}

export const UserContext = createContext<UserContextProps>({ currentUser: { email: '', name: 'Jesper', uid: '123' } });

const UserProvider: FunctionComponent = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  return <UserContext.Provider value={{ currentUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
