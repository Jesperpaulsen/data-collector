import UsageProvider from './contexts/Usage/UsageContext'
import UserProvider from './contexts/User/UserContext'
import Router from './router/Router'

export function App() {
  return (
    <UserProvider>
      <UsageProvider>
        <Router />
      </UsageProvider>
    </UserProvider>
  )
}
