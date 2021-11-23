import { FunctionalComponent } from 'preact'
import { useMemo } from 'preact/hooks'

import { HostDoc } from '../../types/host-doc'
import { byteFormatter } from '../../utils/byteFormatter'
import { co2Formatter } from '../../utils/co2Formatter'
import CustomTable from '../common/CustomTable/CustomTable'

const headers = [
  { label: 'Host', value: 'hostOrigin' },
  { label: 'CO2', value: 'CO2', renderMethod: co2Formatter },
  { label: 'Bytes', value: 'size', renderMethod: byteFormatter },
  { label: 'kWh', value: 'kWh' },
  { label: 'Number of calls', value: 'numberOfCalls' }
]

interface Props {
  usageByHost?: { [host: string]: HostDoc }
}

const HostTable: FunctionalComponent<Props> = ({ usageByHost }) => {
  return (
    <div>
      <CustomTable headers={headers} data={usageByHost || {}} />
    </div>
  )
}

export default HostTable
