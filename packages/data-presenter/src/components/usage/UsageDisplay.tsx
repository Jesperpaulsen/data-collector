import { FunctionalComponent } from 'preact'

import { UsageDetails } from '../../types/UsageDetails'
import Box from '../common/Box'

import UsageLine from './UsageLine'

interface Props {
  todaysUsage: UsageDetails
  totalUsage: UsageDetails
}

const UsageDisplay: FunctionalComponent<Props> = ({
  todaysUsage,
  totalUsage
}) => {
  return (
    <div className="pt-2">
      <Box>
        <UsageLine usage={todaysUsage} label="Todays usage" />
      </Box>
      <Box>
        <UsageLine usage={totalUsage} label="Total usage" />
      </Box>
    </div>
  )
}

export default UsageDisplay
