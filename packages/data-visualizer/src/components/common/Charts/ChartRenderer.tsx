import {
  CategoryScale,
  Chart,
  ChartDataset,
  ChartType,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { createRef, FunctionalComponent, RefObject } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'

import { Dataset, Labels } from '../../../types/chart-types'

Chart.register([
  LineElement,
  LinearScale,
  LineController,
  CategoryScale,
  PointElement,
  Tooltip
])

Chart.defaults.interaction.mode = 'nearest'
Chart.defaults.hover.mode = 'nearest'

Chart.defaults.plugins.tooltip.enabled = true

interface Props {
  chartRef: RefObject<any>
  type: ChartType
  labels: string[]
  datasets: ChartDataset[]
}

const LineChart: FunctionalComponent<Props> = ({
  chartRef,
  type,
  labels,
  datasets
}) => {
  const [chart, setChart] = useState<Chart | undefined>()

  useEffect(() => {
    if (!chart && datasets && labels) {
      const newChart = new Chart(chartRef.current, {
        data: {
          labels,
          datasets
        },
        type: type,
        options: {
          backgroundColor: 'white',
          scales: {
            y: {
              beginAtZero: true
            }
          },
          elements: {
            point: {
              // radius: 0,
              hitRadius: 5
            }
          }
        }
      })
      setChart(newChart)
    }
  }, [chart, chartRef, type, datasets, labels])

  return null
}

export default LineChart
