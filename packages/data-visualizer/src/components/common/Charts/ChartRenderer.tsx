import {
  CategoryScale,
  Chart,
  ChartDataset,
  ChartType,
  LinearScale,
  LineController,
  LineElement,
  PointElement
} from 'chart.js'
import { createRef, FunctionalComponent, RefObject } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'

import { Dataset, Labels } from '../../../types/chart-types'

Chart.register([
  LineElement,
  LinearScale,
  LineController,
  CategoryScale,
  PointElement
])

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
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
        type: type
      })
      setChart(newChart)
    }
  }, [chart, chartRef, type, datasets, labels])

  return null
}

export default LineChart
