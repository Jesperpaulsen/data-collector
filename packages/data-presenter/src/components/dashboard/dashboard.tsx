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
import TipsCarousel from '../common/TipsCarousel'
import Switch from '../common/Switch'
import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES'
import Hover from '../common/Hover'

const Dashboard: FunctionComponent = () => {
  const { todaysUsage, extendedPollution, reports, tips } =
    useContext(UsageContext)

  const toggleExtendedPollution = (value: boolean) => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.SET_EXTENDED_POLLUTION,
      payload: { extendedPollution: value }
    })
  }

  return (
    <div className="w-full h-screen">
      {SHOW_USAGE ? (
        <div className="w-full">
          <Box>
            <UsageLine
              usage={todaysUsage}
              label="Todays usage"
              showProductionPollution={extendedPollution}
            />
            <div className="pt-5">
              <Hover infoText="When toggled, the seconds you have been using the internet is added to the calculations. This is based on an expected lifetime of 3 years per device, and the production cost of your device is converted to active seconds. 80% of the pollution caused by electronic devices is found during production of the device, and is therefore important to try to include in the calculations.">
                <div className="flex justify-center w-full px-4">
                  <Switch
                    initialValue={extendedPollution}
                    onToggled={toggleExtendedPollution}
                    label={
                      'Include the estimated CO2 equivalents from production and use of your device in the calculations'
                    }
                  />
                </div>
              </Hover>
            </div>
          </Box>
          {reports?.length > 0 && (
            <DashboardStatistics
              report={reports[0]}
              todaysUsage={todaysUsage}
            />
          )}
          <TipsCarousel tips={tips} />
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
