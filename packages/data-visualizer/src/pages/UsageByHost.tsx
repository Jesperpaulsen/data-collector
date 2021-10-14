import { FunctionalComponent } from 'preact'
import { useContext, useEffect } from 'preact/hooks'

import Button from '../components/common/Button'
import HostTable from '../components/usageByHost/HostTable'
import { UsageContext } from '../contexts/Usage/UsageContext'

const UsageByHost: FunctionalComponent = () => {
  const { usageState, usageHandler } = useContext(UsageContext)

  useEffect(() => {
    if (!usageState.usageByHost) {
      usageHandler?.getUsageByHost()
    }
  }, [usageState.usageByHost, usageHandler])

  return (
    <div>
      <div className="pb-10">Usage By Host</div>
      <div className="flex justify-end">
        <Button small onClick={() => usageHandler?.getUsageByHost()}>
          Refresh
        </Button>
      </div>
      <HostTable usageByHost={usageState.usageByHost} />
    </div>
  )
}

export default UsageByHost
