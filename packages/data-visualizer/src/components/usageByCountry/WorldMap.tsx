import { FunctionComponent } from 'preact'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'

import { CountryDoc } from '../../types/country-doc'

import CountryLabel from './CountryLabel'
import MapRenderer from './MapRenderer'

interface Props {
  usageByCountry?: { [countryCode: string]: CountryDoc }
  setSelectedCountry: (country?: string) => void
}

const mapDivId = 'worldMap'

const WorldMap: FunctionComponent<Props> = ({
  usageByCountry,
  setSelectedCountry
}) => {
  const [usageDetails, setUsageDetails] = useState<CountryDoc>()
  const [labelPosition, setLabelPosition] = useState<{
    left: number
    top: number
  }>({
    left: 0,
    top: 0
  })
  const [mapRerenderKey, setMapRerenderKey] = useState(
    Math.random().toString(36).substr(7)
  )
  const [filter, setFilter] = useState<
    'size' | 'KWH' | 'CO2' | 'numberOfCalls'
  >('CO2')

  const normalizedValues = useMemo(() => {
    const countryValues: { [countryCode: string]: number } = {}
    if (!usageByCountry) return countryValues

    // We don't want to show usage for unkown countries
    delete usageByCountry['']
    const usage = Object.values(usageByCountry)
    let maxValue = 0

    for (const country of usage) {
      if (country.countryCode === '') continue
      const value = country[filter]
      if (value > maxValue) maxValue = value
    }

    const ratio = 100 / maxValue

    for (const country of usage) {
      countryValues[country.countryCode] = country[filter] * ratio
    }
    return countryValues
  }, [usageByCountry, filter])

  const onHoveringCountry = useCallback(
    (countryCode: string) => {
      if (usageByCountry) setUsageDetails(usageByCountry[countryCode])
    },
    [usageByCountry]
  )

  const handleMouseMouve = (event: any) => {
    if (event.target?.attributes?.length !== 9) {
      setUsageDetails(undefined)
    } else {
      setLabelPosition({ left: event.pageX, top: event.pageY })
    }
  }

  useEffect(() => {
    setMapRerenderKey(Math.random().toString(36).substr(7))
  }, [normalizedValues])

  return (
    <div className="w-full">
      <div key={mapRerenderKey} id="map-wrapper" onMouseMove={handleMouseMouve}>
        <div id={mapDivId} className="h-164 w-full">
          <MapRenderer
            mapDivId={mapDivId}
            values={normalizedValues}
            setSelectedCountry={setSelectedCountry}
            setHoveringCountry={onHoveringCountry}
          />
        </div>
        <CountryLabel
          left={labelPosition.left}
          top={labelPosition.top}
          usageDetails={usageDetails}
        />
      </div>
    </div>
  )
}

export default WorldMap
