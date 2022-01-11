import { FunctionalComponent } from 'preact'

import { UsageDetails } from '../../types/UsageDetails'
import Box from '../common/Box'

import UsageLine from './UsageLine'

interface Props {
  todaysUsage: UsageDetails
  totalUsage: UsageDetails
  showProductionPollution: boolean
}

const UsageDisplay: FunctionalComponent<Props> = ({
  todaysUsage,
  totalUsage,
  showProductionPollution
}) => {
  return (
    <div className="pt-2">
      <Box>
        <UsageLine
          usage={todaysUsage}
          label="Todays usage"
          showProductionPollution={showProductionPollution}
        />
      </Box>
      <Box>
        <UsageLine
          usage={totalUsage}
          label="Total usage"
          showProductionPollution={showProductionPollution}
        />
      </Box>
    </div>
  )
}

export default UsageDisplay
