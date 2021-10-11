import { FunctionComponent } from 'preact'
import { useCallback, useContext, useEffect, useState } from 'preact/hooks'

import Modal from '../components/common/Modal'
import CountryDetails from '../components/usageByCountry/CountryDetails'
import WorldMap from '../components/usageByCountry/WorldMap'
import { UsageContext } from '../contexts/Usage/UsageContext'
import { CountryDoc } from '../types/country-doc'

const UsageByCountry: FunctionComponent = () => {
  const { usageState, usageHandler } = useContext(UsageContext)
  const [selectedCountry, setSelectedCountry] = useState<CountryDoc>()

  useEffect(() => {
    if (!usageState.usageByCountry) {
      usageHandler?.getUsageByCountry()
    }
  }, [usageState, usageHandler])

  const onSelectedCountry = useCallback(
    (country?: string) => {
      if (!country) {
        setSelectedCountry(undefined)
      } else if (
        usageState?.usageByCountry &&
        usageState.usageByCountry[country]
      ) {
        setSelectedCountry(usageState.usageByCountry[country])
      }
    },
    [usageState, setSelectedCountry]
  )

  return (
    <div>
      <div className="pb-10">Usage By Country</div>
      {selectedCountry && (
        <Modal close={() => setSelectedCountry(undefined)}>
          <CountryDetails country={selectedCountry} />
        </Modal>
      )}
      <WorldMap
        usageByCountry={usageState.usageByCountry}
        setSelectedCountry={onSelectedCountry}
      />
    </div>
  )
}

export default UsageByCountry
