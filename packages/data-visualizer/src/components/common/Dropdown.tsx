import { FunctionalComponent } from 'preact'
import { useRef, useState } from 'preact/hooks'

import { useClickedOutsideOfComponent } from '../../hooks/useClickedOutsideOfComponent'

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  onSelected: (value: string) => void
  title: string
}

const DropDown: FunctionalComponent<Props> = ({
  options = [],
  onSelected,
  title
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [option, setOption] = useState<Option | undefined>(options[0])
  const menuRef = useRef(null)

  useClickedOutsideOfComponent({ callback: () => setShowMenu(false) }, menuRef)

  const handleClick = (option: Option) => {
    setOption(option)
    onSelected(option.value)
    setShowMenu(false)
  }

  return (
    <div
      className="relative inline-block text-left border rounded-lg py-2 px-4 bg-white"
      ref={menuRef}>
      <button
        type="button"
        className="inline-flex justify-center rounded-md text-sm text-gray-700 dark:text-grey-400"
        onClick={() => setShowMenu(!showMenu)}>
        {title} {option?.label}
        {options.length > 1 && (
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      {showMenu && options.length > 1 && (
        <div className="origin-top-left absolute right-0 mt-2 rounded-md shadow-lg h-48 overflow-y-auto ring-1 bg-gray-100 ring-black ring-opacity-5 focus:outline-none z-20">
          <div className="py-1" role="none">
            {options.map((option) => (
              <div
                onClick={() => handleClick(option)}
                className="text-gray-700 hover:bg-gray-50 hover:text-gray-900 block px-4 py-2 text-sm cursor-pointer "
                key={`dropdown-${option.value}`}>
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DropDown
