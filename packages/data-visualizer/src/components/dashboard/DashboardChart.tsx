import { createRef, FunctionalComponent } from 'preact'

import LineChart from '../common/LineChart'

const DashboardChart: FunctionalComponent = () => {
  const chartRef = createRef()

  return (
    <div>
      <canvas ref={chartRef} height={400} width={400}>
        <LineChart chartRef={chartRef} />
      </canvas>
    </div>
  )
}

export default DashboardChart
