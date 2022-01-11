import { ChartDataset, ChartType } from 'chart.js'
import { createRef, Fragment, FunctionalComponent } from 'preact'
import { useMemo } from 'preact/hooks'

import { Dataset, Labels } from '../../../types/chart-types'
import { defaultDropdownValues } from '../../../utils/defaultDropdownValue'
import DropDown from '../Dropdown'

import ChartRenderer from './ChartRenderer'

interface Props {
  type: ChartType
  labels: Labels
  datasets: Dataset[]
  small?: boolean
  setFilter: (filter: string) => void
}

const colors = ['#82AC85', '#E2CFC9', '#BFD8C4', '#D1ACA5']

const CustomChart: FunctionalComponent<Props> = ({
  type,
  labels,
  datasets,
  small,
  setFilter
}) => {
  const chartRef = createRef()
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
      const reducedData: number[] = []
      for (const label of labels) {
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

  return (
    <div className="bg-white rounded-lg p-2 shadow-lg">
      <div className="flex justify-center">
        <DropDown
          options={defaultDropdownValues}
          onSelected={setFilter}
          title={'Show:'}
        />
      </div>
      <div className="h-full w-full px-10 pt-4 relative">
        <canvas
          ref={chartRef}
          className={`z-50 ${small ? 'max-h-96' : 'max-h-164'}'`}>
          <ChartRenderer
            chartRef={chartRef}
            type={type}
            labels={reducedLabels}
            datasets={reducedDatasets}
          />
        </canvas>
      </div>
    </div>
  )
}

export default CustomChart
