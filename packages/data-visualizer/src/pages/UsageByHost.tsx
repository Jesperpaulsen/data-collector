import { FunctionalComponent } from 'preact'
import { useContext, useEffect } from 'preact/hooks'

import Table from '../components/common/CustomTable'
import HostTable from '../components/usageByHost/HostTable'
import { UsageContext } from '../contexts/Usage/UsageContext'

const UsageByHost: FunctionalComponent = () => {
  const { usageState, usageHandler } = useContext(UsageContext)

  useEffect(() => {
    if (!usageState.usageByCountry) {
      usageHandler?.getUsageByHost()
    }
  }, [usageState, usageHandler])

  return (
    <div>
      <div className="pb-10">Usage By Host</div>
      <HostTable usageByHost={usageState.usageByHost} />
    </div>
  )
}

export default UsageByHost
