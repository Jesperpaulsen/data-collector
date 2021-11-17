import { FunctionalComponent } from 'preact'
import { useMemo } from 'preact/hooks'

import { HostDoc } from '../../types/host-doc'
import CustomTable from '../common/CustomTable/CustomTable'

const headers = [
  { label: 'Host', value: 'hostOrigin' },
  { label: 'Bytes', value: 'size' },
  { label: 'kWh', value: 'kWh' },
  { label: 'CO2', value: 'CO2' },
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
