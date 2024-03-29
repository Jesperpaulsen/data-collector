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
      <div className="rounded-full flex justify-center items-center bg-gray-500 w-6 h-6 p-1">
        {children}
      </div>
      {showInfo && (
        <div
          className={`absolute w-96 text-sm bg-gray-700 z-50 rounded pl-4 py-2 cursor-default ${
            left ? 'right-0' : ''
          }`}>
          {infoText}
        </div>
      )}
    </div>
  )
}

export default Hover
