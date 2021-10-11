import { Chart } from 'chart.js'
import { createRef, FunctionalComponent, RefObject } from 'preact'
import { useEffect, useState } from 'preact/hooks'

interface Props {
  chartRef: RefObject<any>
}

const LineChart: FunctionalComponent<Props> = ({ chartRef }) => {
  const [chart, setChart] = useState<Chart | undefined>()

  useEffect(() => {
    if (!chart) {
      const newChart = new Chart(chartRef.current, {
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
        type: 'line'
      })
      setChart(newChart)
    }
  }, [chart, chartRef])

  return null
}

export default LineChart
