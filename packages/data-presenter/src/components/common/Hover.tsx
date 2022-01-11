import { FunctionalComponent } from 'preact'
import { useState } from 'preact/hooks'

interface Props {
  infoText: string
  left?: boolean
}

const Hover: FunctionalComponent<Props> = ({ infoText, left, children }) => {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
      className="relative cursor-pointer">
      {children}
      {showInfo && (
        <div
          className={`absolute w-96 text-sm text-white bg-gray-700 z-50 rounded pl-4 py-2 cursor-default ${
            left ? 'right-0' : ''
          }`}>
          {infoText}
        </div>
      )}
    </div>
  )
}

export default Hover
