import dayjs from 'dayjs'
import { FunctionalComponent } from 'preact'
import { useMemo } from 'preact/hooks'

import { UsageReport } from '../../types/UsageReport'
import { calculateDiff } from '../../utils/calculateDiff'
import { co2Formatter } from '../../utils/co2Formatter'

interface Props {
  report: UsageReport
  closeReport: () => void
}

const Report: FunctionalComponent<Props> = ({ report, closeReport }) => {
  const comparedToOwnUsage = useMemo(() => {
    return calculateDiff(
      report.ownPollutionYesterday,
      report.ownAveragePollutionLastWeek
    )
  }, [report.ownPollutionYesterday, report.ownAveragePollutionLastWeek])

  const comparedToOthersUsage = useMemo(() => {
    return calculateDiff(
      report.ownPollutionYesterday,
      report.allAveragePollutionLastWeek
    )
  }, [report.ownPollutionYesterday, report.allAveragePollutionLastWeek])

  const date = useMemo(() => {
    return dayjs.unix(report.date).format('DD/MM/YYYY')
  }, [report.date])

  return (
    <div className="w-11/12 flex justify-center fixed" onClick={closeReport}>
      <div className="bg-white rounded w-full h-9/12 p-10 shadow-2xl z-50 relative">
        <div className="absolute top-2 right-2 rounded-full flex justify-center items-center hover:bg-gray-300 cursor-pointer w-4 h-4 bg-gray-200">
          X
        </div>
        <div className="font-bold">Report for {date}</div>
        <div>You polluted {co2Formatter(report.ownPollutionYesterday)}</div>
        {report.ownPollutionYesterday > 0 && (
          <div className="flex justify-center">
            <div>
              <div>{comparedToOwnUsage}</div>
              <div>
                Your usage {date} compared to your own usage in the 7 previous
                days
              </div>
            </div>
            <div>
              <div>{comparedToOthersUsage}</div>
              <div>
                Your usage {date} compared to everyone else usage in the 7
                previous days
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Report
