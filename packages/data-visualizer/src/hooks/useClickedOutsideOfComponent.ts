import { useEffect } from 'preact/hooks'

interface Props {
  callback: () => void
}

export const useClickedOutsideOfComponent = ({ callback }: Props, ref: any) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target

      if (!ref?.current?.base || !target) {
        return
      }

      if (!ref.current.base.contains(target)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [callback, ref])
}
