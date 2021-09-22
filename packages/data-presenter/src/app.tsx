import Dashboard from './components/dashboard/dashboard';
import Login from './components/login/login';
import UserProvider from './contexts/UserContext';
import Router from './Router';

export function App() {
  return <UserProvider>
    <Router />
  </UserProvider>
}
