import { FunctionalComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import 'jsvectormap'
import 'jsvectormap/dist/maps/world.js'
interface Props {
  mapDivId: string
  values: { [countryCode: string]: number } | undefined
  setHoveringCountry: (countryCode: string) => void
  setSelectedCountry: (countryCode: string) => void
}

const MapRenderer: FunctionalComponent<Props> = ({
  mapDivId,
  values,
  setHoveringCountry,
  setSelectedCountry
}) => {
  const [map, setMap] = useState<any | undefined>(undefined)

  useEffect(() => {
    if (!map) {
      try {
        // @ts-ignore
        // eslint-disable-next-line
        const map = new jsVectorMap({
          selector: `#${mapDivId}`,
          map: 'world',
          showTooltip: true,
          zoomButtons: false,
          regionsSelectable: true,
          regionsSelectableOne: true,
          visualizeData: {
            scale: ['#D97F7F', '#ff0000'],
            values: values || {}
          },
          regionStyle: {
            initial: {
              stroke: '#676767',
              strokeWidth: 0.3,
              fill: '#696969',
              fillOpacity: 1
            }
          },
          onLoaded(map) {
            window.addEventListener('resize', () => {
              map.updateSize()
            })
          },
          onRegionTooltipShow(tooltip, code) {
            setHoveringCountry(code)
            tooltip
              .css({
                display: 'none'
              })
              .text()
          },
          onRegionSelected(code) {
            setSelectedCountry(code)
          }
        })
        setMap(map)
      } catch (e) {
        console.log(e)
      }
    }
    return () => window.removeEventListener('resize', map?.updateSize)
  }, [mapDivId, values, map, setHoveringCountry, setSelectedCountry])

  return null
}

export default MapRenderer
