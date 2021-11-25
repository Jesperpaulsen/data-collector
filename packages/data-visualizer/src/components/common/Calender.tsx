import dayjs from 'dayjs'
import { FunctionalComponent } from 'preact'
import { useRef, useState } from 'preact/hooks'
import ReactCalendar from 'react-calendar'

import { useClickedOutsideOfComponent } from '../../hooks/useClickedOutsideOfComponent'

import Button from './Button'

interface Props {
  onDateChanged: (date?: Date) => void
}

const Calendar: FunctionalComponent<Props> = ({ onDateChanged }) => {
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const calendarRef = useRef(null)

  useClickedOutsideOfComponent(
    { callback: () => setShowCalendar(false) },
    calendarRef
  )

  return (
    <div className="relative">
      <div className="flex justify-center items-center">
        <div
          className="bg-white py-2 px-3 rounded-lg border cursor-pointer mr-1 w-56"
          onClick={() => setShowCalendar(true)}>
          {selectedDate ? (
            dayjs(selectedDate).format('DD/MM/YYYY')
          ) : (
            <span className="font-light text-sm text-opacity-50 text-gray-500">
              Select a specific date
            </span>
          )}
        </div>
        {selectedDate && (
          <Button
            small
            onClick={() => {
              setSelectedDate(undefined)
              onDateChanged(undefined)
            }}>
            Clear
          </Button>
        )}
      </div>
      {showCalendar && (
        <div className="absolute top-0">
          <ReactCalendar
            ref={calendarRef}
            onChange={(date: Date) => {
              setSelectedDate(date)
              setShowCalendar(false)
              onDateChanged(date)
            }}
            maxDate={new Date()}
          />
        </div>
      )}
    </div>
  )
}

export default Calendar
