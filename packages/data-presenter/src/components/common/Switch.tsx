import { FunctionalComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'

interface Props {
  initialValue: boolean
  onToggled: (value: boolean) => void
  label: string
}

const Switch: FunctionalComponent<Props> = ({
  initialValue,
  onToggled,
  label
}) => {
  const [toggle, setToggle] = useState(initialValue)

  useEffect(() => {
    setToggle(initialValue)
  }, [initialValue])

  const handleToggle = () => {
    const newValue = !toggle
    onToggled(newValue)
    setToggle(newValue)
  }

  return (
    <div className="flex items-center">
      <div className="pr-3">{label}</div>
      <div
        className={`md:w-14 md:h-7 w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transform duration-300 ${
          toggle ? 'bg-green-800' : 'bg-gray-300'
        }`}
        onClick={handleToggle}>
        <div
          className={`bg-white md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform duration-300 ease-in-out ${
            toggle ? 'transform translate-x-5' : ''
          }`}
        />
      </div>
    </div>
  )
}

export default Switch
