import { FunctionComponent } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'

import 'jsvectormap'
import 'jsvectormap/dist/maps/world.js'

import { CountryDoc } from '../../types/country-doc'

import CountryLabel from './CountryLabel'
import MapRenderer from './MapRenderer'

interface Props {
  usageByCountry?: { [countryCode: string]: CountryDoc }
}

const WorldMap: FunctionComponent<Props> = ({ usageByCountry }) => {
  const [usageDetails, setUsageDetails] = useState<CountryDoc>()
  const [labelPosition, setLabelPosition] = useState<{
    left: number
    top: number
  }>({
    left: 0,
    top: 0
  })
  const [mapDivId, setMapDivId] = useState(Math.random().toString(36).substr(7))
  const [filter, setFilter] = useState<
    'size' | 'KWH' | 'CO2' | 'numberOfCalls'
  >('CO2')

  const values = useMemo(() => {
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

    const ratio = 300 / maxValue

    for (const country of usage) {
      countryValues[country.countryCode] = country[filter] * ratio
    }
    return countryValues
  }, [usageByCountry, filter])

  const onSelctedCountry = (countryCode: string) => {
    if (usageByCountry) setUsageDetails(usageByCountry[countryCode])
  }

  const handleMouseMouve = (event: any) => {
    if (event.target?.attributes?.length !== 9) {
      setUsageDetails(undefined)
    } else {
      setLabelPosition({ left: event.pageX, top: event.pageY })
    }
  }

  useEffect(() => {
    console.log(values)
    setMapDivId(Math.random().toString(36).substr(7))
  }, [values])

  return (
    <div className="w-full">
      <div
        id={mapDivId}
        className="h-164 w-full"
        key={mapDivId}
        onMouseMove={handleMouseMouve}>
        <MapRenderer
          mapDivId={mapDivId}
          values={values}
          setSelectedCountry={onSelctedCountry}
        />
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
