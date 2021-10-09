import { FunctionComponent } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'

import WorldMap from '../components/usageByCountry/WorldMap'
import { UsageContext } from '../contexts/Usage/UsageContext'

const UsageByCountry: FunctionComponent = () => {
  const { usageState, usageHandler } = useContext(UsageContext)

  useEffect(() => {
    if (!usageState.usageByCountry) {
      usageHandler?.getUsageByCountry()
    }
  }, [usageState, usageHandler])

  return (
    <div>
      <div className="pb-10">Usage By Country</div>
      <WorldMap usageByCountry={usageState.usageByCountry} />
    </div>
  )
}

export default UsageByCountry
