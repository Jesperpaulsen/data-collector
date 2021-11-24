import { FunctionalComponent } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import Calendar from 'react-calendar'

import Button from '../components/common/Button'
import HostTable from '../components/usageByHost/HostTable'
import { UsageContext } from '../contexts/Usage/UsageContext'

import 'react-calendar/dist/Calendar.css'

const UsageByHost: FunctionalComponent = () => {
  const { usageState, usageHandler } = useContext(UsageContext)

  const [showCalendar, setShowCalendar] = useState(false)
  const [date, selectDate] = useState<Date>()

  useEffect(() => {
    if (!usageState.usageByHost) {
      usageHandler?.getUsageByHost()
    }
  }, [usageState.usageByHost, usageHandler])

  return (
    <div>
      <div className="relative flex justify-end">
        {/* showCalendar ? (
          <div className="absolute top-0">
            <Calendar
              onChange={(change) => console.log(change)}
              maxDate={new Date()}
            />
          </div>
        ) : (
          <Button onClick={() => setShowCalendar(true)}>Select date</Button>
        ) */}
        <Button small onClick={() => usageHandler?.getUsageByHost()}>
          Refresh
        </Button>
      </div>
      <HostTable usageByHost={usageState.usageByHost} />
    </div>
  )
}

export default UsageByHost
