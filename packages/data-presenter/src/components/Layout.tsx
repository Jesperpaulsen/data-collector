import { FunctionalComponent } from 'preact'
import { useContext } from 'preact/hooks'
import { UserContext } from '../contexts/UserContext'
import externalLink from './layout/external-link.svg'
import Greeting from './layout/Greeting'

interface Props {
  routes: { key: string; label: string; externalURL?: boolean }[]
  activeRoute: string
  onClick: (route: string) => void
}

const Layout: FunctionalComponent<Props> = ({
  routes,
  onClick,
  activeRoute,
  children
}) => {
  const { currentUser } = useContext(UserContext)

  return (
    <div className="w-full h-screen">
      <div className="flex justify-between w-full">
        <div>
          <Greeting name={currentUser?.name} />
        </div>
        <div className="flex justify-end h-4">
          {routes.map((route) => {
            return (
              <div
                key={route.key}
                onClick={() => onClick(route.key)}
                className={`px-1 text-black flex items-center ${
                  activeRoute === route.label
                    ? 'underline'
                    : 'cursor-pointer hover:underline'
                }`}>
                {route.label}
                {route.externalURL && (
                  <div className="w-3 h-3">
                    <img src={externalLink} alt="Icon of external url" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default Layout
