import { Chart, ChartType } from 'chart.js'
import { createRef, FunctionalComponent, RefObject } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import ChartRenderer from './ChartRenderer'

interface Props {
  type: ChartType
}

const CustomChart: FunctionalComponent<Props> = ({ type }) => {
  const chartRef = createRef()
  console.log('rerender')
  return (
    <div className="h-full w-full">
      <canvas ref={chartRef} className="max-h-full w-full bg-secondary">
        <ChartRenderer chartRef={chartRef} type={type} />
      </canvas>
    </div>
  )
}

export default CustomChart
