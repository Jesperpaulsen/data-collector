import { FunctionComponent } from 'preact'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'preact/hooks'

import AutoComplete from '../components/common/AutoComplete'
import Button from '../components/common/Button'
import DropDown from '../components/common/Dropdown'
import Modal from '../components/common/Modal'
import CountryDetails from '../components/usageByCountry/CountryDetails'
import WorldMap from '../components/usageByCountry/WorldMap'
import { UsageContext } from '../contexts/Usage/UsageContext'
import { CountryDoc } from '../types/country-doc'
import { HostDoc } from '../types/host-doc'
import { HostToCountry } from '../types/host-to-country'
import { defaultDropdownValues } from '../utils/defaultDropdownValue'

const UsageByCountry: FunctionComponent = () => {
  const { usageState, usageHandler } = useContext(UsageContext)
  const [selectedCountry, setSelectedCountry] = useState<
    CountryDoc | HostToCountry
  >()
  const [selectedHost, setSelectedHost] = useState<HostDoc>()
  const [usageByCountry, setUsageByCountry] = useState<{
    [host: string]: CountryDoc | HostToCountry
  }>({})
  const [filter, setFilter] = useState(defaultDropdownValues[0].value)

  useEffect(() => {
    if (!usageState.usageByCountry) {
      usageHandler?.getUsageByCountry()
    }
    if (!usageState.usageByHost) {
      usageHandler?.getUsageByHost()
    }
  }, [usageState, usageHandler])

  const onSelectedCountry = useCallback(
    (country?: string) => {
      if (!country) {
        setSelectedCountry(undefined)
      } else if (usageByCountry && usageByCountry[country]) {
        setSelectedCountry(usageByCountry[country])
      }
    },
    [usageByCountry, setSelectedCountry]
  )

  const getCountryForHost = async (hostOrigin: string) => {
    if (hostOrigin && usageHandler) {
      const res = await usageHandler?.getCountryForHost(hostOrigin)
      setUsageByCountry(res)
    } else if (usageState.usageByCountry) {
      setUsageByCountry(usageState.usageByCountry)
    }
  }

  useEffect(() => {
    if (usageState.usageByCountry) setUsageByCountry(usageState.usageByCountry)
  }, [usageState.usageByCountry])

  const possibleHosts = useMemo(() => {
    const hosts = Object.values(usageState?.accumulatedUsageByHost || {})
    return hosts.map((host) => {
      const readableHost =
        usageState.aliasMap.get(host.hostOrigin) || host.hostOrigin
      return { label: readableHost, value: host.hostOrigin }
    })
  }, [usageState.accumulatedUsageByHost, usageState.aliasMap])

  return (
    <div>
      {selectedCountry && (
        <Modal close={() => setSelectedCountry(undefined)}>
          <CountryDetails
            country={selectedCountry}
            specificHost={selectedHost?.hostOrigin || ''}
            aliasMap={usageState.aliasMap}
          />
        </Modal>
      )}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between pb-2">
          <div className="flex items-center">
            <AutoComplete
              possibleValues={possibleHosts}
              onClick={(host) => {
                if (usageState?.accumulatedUsageByHost) {
                  const hostDoc = usageState.accumulatedUsageByHost[host]
                  setSelectedHost(hostDoc)
                  getCountryForHost(hostDoc.hostOrigin)
                }
              }}
              onChange={(host) => {
                if (usageState?.accumulatedUsageByHost) {
                  const hostDoc = usageState.accumulatedUsageByHost[host]
                  if (!hostDoc && usageState.usageByCountry) {
                    setSelectedHost(undefined)
                    setUsageByCountry(usageState.usageByCountry)
                  }
                } else {
                  setSelectedHost(undefined)
                }
              }}
              onClear={() => {
                setSelectedHost(undefined)
                if (usageState.usageByCountry) {
                  setUsageByCountry(usageState.usageByCountry)
                }
              }}
            />
            <div className="pl-4">
              <DropDown
                onSelected={setFilter}
                options={defaultDropdownValues}
                title="Filter:"
              />
            </div>
          </div>
          <Button
            small
            onClick={() => {
              usageHandler?.getUsageByCountry()
              usageHandler?.getUsageByHost()
            }}>
            Refresh
          </Button>
        </div>
        <WorldMap
          usageByCountry={usageByCountry}
          setSelectedCountry={onSelectedCountry}
          filter={filter}
        />
      </div>
    </div>
  )
}

export default UsageByCountry
