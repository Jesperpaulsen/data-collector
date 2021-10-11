import { FunctionalComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import 'jsvectormap'
import 'jsvectormap/dist/maps/world.js'
interface Props {
  mapDivId: string
  values: { [countryCode: string]: number } | undefined
  setSelectedCountry: (countryCode: string) => void
}

const MapRenderer: FunctionalComponent<Props> = ({
  mapDivId,
  values,
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
            scale: ['#FF7F7F', '#ff0000'],
            values: values || {}
          },
          onLoaded(map) {
            window.addEventListener('resize', () => {
              map.updateSize()
            })
          },
          onRegionTooltipShow(tooltip, code) {
            setSelectedCountry(code)
            tooltip
              .css({
                display: 'none'
              })
              .text()
          }
        })
        setMap(map)
      } catch (e) {
        console.log(e)
      }
    }
    return () => window.removeEventListener('resize', map?.updateSize)
  }, [mapDivId, values, map, setSelectedCountry])

  return null
}

export default MapRenderer
