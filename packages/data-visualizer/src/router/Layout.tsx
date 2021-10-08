import { FunctionComponent } from 'preact'
import { Link } from 'preact-router'
import { useContext } from 'preact/hooks'
import Greeting from '../components/layout/Greeting'
import TodaysUsage from '../components/layout/TodaysUsage'
import { UsageContext } from '../contexts/Usage/UsageContext'
import { UserContext } from '../contexts/User/UserContext'
import { routeComponents } from './Router'

const Layout: FunctionComponent = ({ children }) => {
  const { userState } = useContext(UserContext)
  const { usageState } = useContext(UsageContext)

  return <div className="flex justify-start">
    <div className="hidden md:block w-40 bg-secondary text-center h-screen pt-10">
      {Object.entries(routeComponents).map(([key, value]) => {
        if (!value.label) return null
        return <div className="pt-5 text-sm">
          <Link className={window.location.pathname === key ? "text-primary" : "text-black hover:text-primary cursor-pointer"} href={key}>
          {value.label}
        </Link>
        </div>
      })}
    </div>
    <div className="pt-3 px-4 md:px-10 w-full">
      <div className="flex justify-between">
        <Greeting name={userState.currentUser?.name} />
        <TodaysUsage todaysUsage={usageState.todaysUsage} />
      </div>
      {children}
    </div>
  </div>
}

export default Layout
