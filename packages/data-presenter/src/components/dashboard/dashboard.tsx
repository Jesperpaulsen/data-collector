import { FunctionComponent } from 'preact'
import UsageDisplay from '../usage/UsageDisplay'
import Button from '../common/Button'
import { SHOW_USAGE } from '../../config'
import { useContext, useMemo } from 'preact/hooks'
import { UsageContext } from '../../contexts/UsageContext'
import { calculateDiff } from '../../utils/calculateDiff'
import UsageLine from '../usage/UsageLine'
import DashboardStatistics from './DashboardStatistics'
import Box from '../common/Box'

const Dashboard: FunctionComponent = () => {
  const { todaysUsage, totalUsage, reports } = useContext(UsageContext)

  return (
    <div className="w-full h-screen">
      {SHOW_USAGE ? (
        <div className="w-full">
          <Box>
            <UsageLine usage={todaysUsage} label="Todays usage" />
          </Box>
          {reports?.length > 0 && (
            <DashboardStatistics
              report={reports[0]}
              todaysUsage={todaysUsage}
            />
          )}
          <div className="flex justify-center pt-2">
            <Button
              onClick={() =>
                window.open('https://dashboard.jesper.no', '_blank')
              }>
              Explore usage
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center h-2/3">
          <div className="text-3xl text-green-800">
            Your usage is currently beeing collected.
          </div>
          <div className="text-xl">
            In the next round you will be able to see your usage in real time.
          </div>
          <div className="text-sm pt-10">
            You can't see your usage now because we want to see if your habits
            change when you get access to see your pollution. Thanks for
            participating.
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
