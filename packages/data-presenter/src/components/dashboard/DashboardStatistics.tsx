import { FunctionalComponent } from 'preact'
import { useMemo } from 'preact/hooks'

import { UsageDetails } from '../../types/UsageDetails'
import { UsageReport } from '../../types/UsageReport'
import { calculateDiff } from '../../utils/calculateDiff'
import { co2Formatter } from '../../utils/co2Formatter'
import Box from '../common/Box'

interface Props {
  report: UsageReport
  todaysUsage: UsageDetails
}

const DashboardStatistics: FunctionalComponent<Props> = ({
  report,
  todaysUsage
}) => {
  const comparedToOwnUsage = useMemo(() => {
    return calculateDiff(todaysUsage.CO2, report.ownAveragePollutionLastWeek)
  }, [report, todaysUsage])

  const comparedToOthersUsage = useMemo(() => {
    return calculateDiff(todaysUsage.CO2, report.allAveragePollutionLastWeek)
  }, [report, todaysUsage])

  return (
    <Box>
      <div className="text-center">
        Statistics
        <div className="flex justify-evenly pt-2">
          <div className="w-64">
            <div
              className={`${
                comparedToOwnUsage?.higher ? 'text-red-800' : 'text-green-800'
              } text-center text-2xl font-medium`}>
              {comparedToOwnUsage?.diff.toFixed(0)} %
            </div>
            <div className="text-center text-xs pt-2">
              {comparedToOwnUsage?.higher ? 'Higer' : 'Lower'} pollution today
              compared to your average pollution last week (
              {co2Formatter(report.ownAveragePollutionLastWeek)}).
            </div>
          </div>
          <div className="w-64">
            <div
              className={`${
                comparedToOthersUsage?.higher
                  ? 'text-red-800'
                  : 'text-green-800'
              } text-center text-2xl font-medium`}>
              {comparedToOthersUsage?.diff.toFixed(0)} %
            </div>
            <div className="text-center text-xs pt-2">
              {comparedToOthersUsage?.higher ? 'Higher' : 'Lower'} pollution
              today compared to everyone else's average pollution last week (
              {co2Formatter(report.allAveragePollutionLastWeek)}).
            </div>
          </div>
        </div>
      </div>
    </Box>
  )
}

export default DashboardStatistics
