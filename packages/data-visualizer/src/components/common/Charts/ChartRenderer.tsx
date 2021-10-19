import {
  CategoryScale,
  Chart,
  ChartDataset,
  ChartType,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js'
import { FunctionalComponent, RefObject } from 'preact'
import { useEffect, useState } from 'preact/hooks'

Chart.register([
  LineElement,
  LinearScale,
  LineController,
  CategoryScale,
  PointElement,
  Tooltip,
  Legend
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
              hitRadius: 5
            }
          }
        }
      })
      setChart(newChart)
    }
  }, [chart, chartRef, type, datasets, labels])

  useEffect(() => {
    const updateData = (
      chart: Chart,
      labels: string[],
      datasets: ChartDataset[]
    ) => {
      chart.data = { labels, datasets }
      chart.update()
    }

    if (chart) {
      updateData(chart, labels, datasets)
    }
  }, [datasets, chart, labels])

  return null
}

export default LineChart
