import { Chart, ChartDataset, ChartType } from 'chart.js'
import { createRef, FunctionalComponent, RefObject } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'

import { Dataset, Labels } from '../../../types/chart-types'

import ChartRenderer from './ChartRenderer'

interface Props {
  type: ChartType
  labels: Labels
  datasets: Dataset[]
}

const colors = ['red', 'blue']

const CustomChart: FunctionalComponent<Props> = ({
  type,
  labels,
  datasets
}) => {
  const chartRef = createRef()
  const [key, setKey] = useState(Math.random().toString(36).substr(7))
  const reducedLabels = useMemo(() => {
    const res: string[] = []
    for (const label of labels) {
      res.push(label.label)
    }
    return res
  }, [labels])

  const reducedDatasets = useMemo(() => {
    const res: ChartDataset[] = []
    let i = 0
    for (const dataset of datasets) {
      console.log(dataset.data)
      const reducedData: number[] = []
      for (const label of labels) {
        console.log(label.value)
        const data = dataset.data[label.value] || 0
        reducedData.push(data)
      }

      res.push({
        label: dataset.label,
        data: reducedData,
        fill: false,
        borderColor: colors[i],
        backgroundColor: colors[i],
        tension: 0.1
      })
      i++
    }
    return res
  }, [datasets, labels])

  useEffect(() => {
    setKey(Math.random().toString(36).substr(7))
  }, [setKey, reducedLabels, reducedDatasets])

  return (
    <div className="h-full w-full relative">
      <canvas key={key} ref={chartRef} className="z-50 bg-secondary">
        <ChartRenderer
          chartRef={chartRef}
          type={type}
          labels={reducedLabels}
          datasets={reducedDatasets}
        />
      </canvas>
    </div>
  )
}

export default CustomChart
