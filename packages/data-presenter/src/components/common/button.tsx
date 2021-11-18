import classnames from 'classnames'
import { FunctionalComponent } from 'preact'

import styles from './button.module.css'

interface Props {
  disabled?: boolean
  outline?: boolean
  small?: boolean
  block?: boolean
  onClick: () => void
}

const Button: FunctionalComponent<Props> = ({
  children,
  disabled,
  onClick,
  small,
  outline,
  block
}) => {
  return (
    <button
      onClick={onClick}
      className={classnames(styles.btn, {
        [styles['btn--outline']]: outline,
        [styles['btn--small']]: small,
        [styles['btn--block']]: block
      })}>
      {children}
    </button>
  )
}

export default Button
