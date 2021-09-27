import UsageProvider from './contexts/UsageContext';
import UserProvider from './contexts/UserContext';
import Router from './Router';

export function App() {
  return (
    <UserProvider>
        <UsageProvider>
          <Router />
        </UsageProvider>
    </UserProvider>
  )
}
