import { Fragment, FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'

interface InputProps {
  initialValue?: string
  label?: string
  placeholder?: string
  onChange: (input: string) => void
  onFocus?: () => void
  onBlur?: () => void
  type?: string
}

const Input: FunctionComponent<InputProps> = ({
  initialValue,
  label,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  type
}) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = (e: any) => {
    const value = e.target.value
    setValue(value)
    onChange(value)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <Fragment>
      <div className="text-xs text-gray-700 pl-1">{label}</div>
      <input
        onFocus={() => (onFocus ? onFocus() : null)}
        onBlur={() => (onBlur ? onBlur() : null)}
        type={type || 'text'}
        className="border p-4 w-full border-gray-200 text-gray-900 rounded-xl bg-gwhite bg-opacity-40 appearance-none leading-tight focus:outline-none focus:shadow-outline text-sm"
        placeholder={placeholder}
        value={value}
        onInput={handleChange}
      />
    </Fragment>
  )
}

export default Input
