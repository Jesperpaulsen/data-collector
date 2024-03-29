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

  return (
    <div className="w-11/12 flex justify-center fixed" onClick={closeReport}>
      <div className="bg-white rounded w-full h-9/12 p-10 shadow-2xl z-50 relative">
        <div className="absolute top-2 right-2 rounded-full flex justify-center items-center hover:bg-gray-300 cursor-pointer w-4 h-4 bg-gray-200">
          X
        </div>
        <div className="font-bold pb-5">
          Report for {dayjs.unix(report.date).format('DD/MM/YYYY')}
        </div>
        <div className="text-lg text-center pb-5">
          You polluted {co2Formatter(report.ownPollutionYesterday)} CO
          <sub>2</sub> equivalents.
        </div>
        {report.ownPollutionYesterday > 0 && (
          <div className="flex justify-evenly pt-2">
            <div className="w-44">
              <div
                className={`${
                  comparedToOthersUsage?.higher
                    ? 'text-red-500'
                    : 'text-green-500'
                } text-center text-2xl font-bold`}>
                {comparedToOwnUsage?.diff.toFixed(0)} %
              </div>
              <div className="text-center text-xs pt-2">
                {comparedToOwnUsage?.higher ? 'Higher' : 'Lower'} pollution
                compared to your own average pollution in the 7 previous days (
                {co2Formatter(report.ownAveragePollutionLastWeek)})
              </div>
            </div>
            <div className="w-44">
              <div
                className={`${
                  comparedToOthersUsage?.higher
                    ? 'text-red-500'
                    : 'text-green-500'
                } text-center text-2xl font-bold`}>
                {comparedToOthersUsage?.diff.toFixed(0)} %
              </div>
              <div className="text-center text-xs pt-2">
                {comparedToOthersUsage?.higher ? 'Higher' : 'Lower'} pollution
                compared to everyone else's average polution in the 7 previous
                days ({co2Formatter(report.allAveragePollutionLastWeek)})
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Report
