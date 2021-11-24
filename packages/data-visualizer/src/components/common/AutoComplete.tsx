import { FunctionalComponent } from 'preact'
import { useMemo, useState } from 'preact/hooks'

import Button from './Button'
import Input from './Input'

interface Props {
  possibleValues: { label: string; value: string }[]
  onClick: (value: string) => void
  onChange: (value: string) => void
  onClear: () => void
}

const AutoComplete: FunctionalComponent<Props> = ({
  possibleValues,
  onClick,
  onChange,
  onClear
}) => {
  const [input, setInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState('')
  const [isHoveringList, setIsHoveringList] = useState(false)

  const relevantResults = useMemo(() => {
    if (showDropdown) {
      return [...possibleValues].filter((possibleMath) =>
        possibleMath.label.includes(input)
      )
    }
    return []
  }, [input, possibleValues, showDropdown])

  const onSelectedResult = ({
    label,
    value
  }: {
    label: string
    value: string
  }) => {
    setShowDropdown(false)
    setSelectedLabel(label)
    setInput(label)
    onClick(value)
  }

  return (
    <div className="w-96">
      <div className="relative w-full">
        <div className="flex items-center">
          <Input
            onFocus={() => {
              setShowDropdown(true)
              onChange(input)
            }}
            onBlur={() => {
              if (!isHoveringList) {
                setShowDropdown(false)
                onChange(input)
              }
            }}
            onChange={(input) => {
              setSelectedLabel('')
              setShowDropdown(true)
              setInput(input)
              onChange(input)
            }}
            initialValue={selectedLabel}
            placeholder="Search for host"
          />
          <div className="pl-2">
            <Button
              small
              onClick={() => {
                setInput('')
                onChange('')
                setSelectedLabel('')
                setShowDropdown(false)
                onClear()
              }}>
              Clear
            </Button>
          </div>
        </div>
        <div
          className="absolute -top-100 bg-gray-100 w-full rounded-lg max-h-52 overflow-y-auto"
          onMouseEnter={() => setIsHoveringList(true)}
          onMouseLeave={() => setIsHoveringList(false)}>
          {showDropdown &&
            relevantResults.map((relevantResult) => (
              <div
                key={relevantResult.value}
                className="border-b p-2 text-sm hover:bg-gray-200 cursor-pointer rounded-lg"
                onClick={() => onSelectedResult(relevantResult)}>
                {relevantResult.label}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default AutoComplete
