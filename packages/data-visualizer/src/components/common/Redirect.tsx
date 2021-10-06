import { FunctionComponent } from 'preact'
import { useEffect } from 'preact/hooks'
import { route } from 'preact-router'

interface RedirectProps {
  to: string
}

const Redirect: FunctionComponent<RedirectProps> = ({ to }) => {
  console.log('yo')

  route(to, true)

  return null
}

export default Redirect
