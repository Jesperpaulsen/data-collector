import dayjs from 'dayjs'
import { FunctionalComponent } from 'preact'
import { useContext, useEffect, useMemo, useState } from 'preact/hooks'

import Button from '../components/common/Button'
import Calendar from '../components/common/Calender'
import HostTable from '../components/usageByHost/HostTable'
import { UsageContext } from '../contexts/Usage/UsageContext'
import { HostDoc } from '../types/host-doc'
import { getStartOfDateInUnix } from '../utils/date'

import 'react-calendar/dist/Calendar.css'

const UsageByHost: FunctionalComponent = () => {
  const { usageState, usageHandler } = useContext(UsageContext)
  const [date, setDate] = useState<number>()

  useEffect(() => {
    if (!usageState.usageByHost) {
      usageHandler?.getUsageByHost()
    }
  }, [usageState.usageByHost, usageHandler])

  const onDateChanged = (date?: Date) => {
    if (!date) {
      setDate(undefined)
      return
    }
    console.log(dayjs(date).add(1, 'hour').utc().unix())
    setDate(dayjs(date).add(1, 'hour').utc().unix())
  }

  const usageByHost = useMemo(() => {
    if (!usageState.usageByHost || !usageState.accumulatedUsageByHost) return {}
    const res: { [host: string]: HostDoc } = {}
    for (const usageDoc of Object.values(usageState.usageByHost)) {
      if (date && usageDoc.date !== date) continue
      usageDoc.hostOrigin =
        usageState?.aliasMap.get(usageDoc.hostOrigin) || usageDoc.hostOrigin
      res[usageDoc.hostOrigin] = usageDoc
    }
    return res
  }, [
    date,
    usageState?.usageByHost,
    usageState?.accumulatedUsageByHost,
    usageState?.aliasMap
  ])

  return (
    <div>
      <div className="relative flex justify-end">
        <Button small onClick={() => usageHandler?.getUsageByHost()}>
          Refresh
        </Button>
      </div>
      <HostTable usageByHost={usageByHost} onDateChanged={onDateChanged} />
    </div>
  )
}

export default UsageByHost
