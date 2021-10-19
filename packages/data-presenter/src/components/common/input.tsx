import { Fragment, FunctionComponent } from 'preact'
import { useState } from 'preact/hooks'

interface InputProps {
  initialValue?: string
  label?: string
  placeholder?: string
  onChange: (input: string) => void
  type?: string
}

const Input: FunctionComponent<InputProps> = ({
  initialValue,
  label,
  placeholder,
  onChange,
  type
}) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = (e: any) => {
    const value = e.target.value
    setValue(value)
    onChange(value)
  }

  return (
    <Fragment>
      <div className="text-xs text-gray-700 pl-1">{label}</div>
      <input
        type={type || 'text'}
        className="border-b p-1 w-full border-gray-400 text-white bg-gray-900 bg-opacity-0 appearance-none leading-tight focus:outline-none focus:shadow-outline text-sm placeholder-gray-200"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </Fragment>
  )
}

export default Input
