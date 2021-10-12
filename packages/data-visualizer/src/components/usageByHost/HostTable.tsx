import { FunctionalComponent } from 'preact'
import { useMemo } from 'preact/hooks'

import { HostDoc } from '../../types/host-doc'
import CustomTable from '../common/CustomTable'

const headers = [
  { label: 'Host', value: 'hostOrigin' },
  { label: 'Bytes', value: 'size' },
  { label: 'KWH', value: 'KWH' },
  { label: 'CO2', value: 'CO2' },
  { label: 'Number of calls', value: 'numberOfCalls' },
  { label: 'Number of calls without size', value: 'numberOfCallsWithoutSize' }
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
