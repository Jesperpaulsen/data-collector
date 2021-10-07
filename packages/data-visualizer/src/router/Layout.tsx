import { FunctionComponent } from 'preact'
import { Link } from 'preact-router'
import { useContext } from 'preact/hooks'
import Greeting from '../components/dashboard/Greeting'
import { UserContext } from '../contexts/User/UserContext'
import { routeComponents } from './Router'

const Layout: FunctionComponent = ({ children }) => {
  const { userState } = useContext(UserContext)

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
    <div className="-pt-3">
      <div className="flex">
        <Greeting name={userState.currentUser?.name} />
      </div>
      {children}
    </div>
  </div>
}

export default Layout
