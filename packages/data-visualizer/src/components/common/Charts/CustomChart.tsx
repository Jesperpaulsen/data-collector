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

const CustomChart: FunctionalComponent<Props> = ({
  type,
  labels,
  datasets
}) => {
  const chartRef = createRef()
  const [key, setKey] = useState(Math.random().toString(36).substr(7))
  console.log('yo')
  const reducedLabels = useMemo(() => {
    const res: string[] = []
    for (const label of labels) {
      res.push(label.label)
    }
    return res
  }, [labels])

  const reducedDatasets = useMemo(() => {
    const res: ChartDataset[] = []
    console.log('recalc')
    for (const dataset of datasets) {
      const reducedData: number[] = []
      for (const label of labels) {
        const data = dataset.data[label.value] || 0
        reducedData.push(data)
      }
      res.push({ label: dataset.label, data: reducedData })
    }
    return res
  }, [datasets, labels])

  useEffect(() => {
    setKey(Math.random().toString(36).substr(7))
  }, [setKey, reducedLabels, reducedDatasets])

  return (
    <div className="h-full w-full">
      <canvas
        key={key}
        ref={chartRef}
        className="max-h-full w-full bg-secondary">
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
