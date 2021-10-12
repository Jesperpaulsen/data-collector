import { createRef, FunctionalComponent } from 'preact'

import CustomChart from '../common/Charts/CustomChart'

const DashboardChart: FunctionalComponent = () => {
  const chartRef = createRef()

  return (
    <div className="h-164">
      <CustomChart type={'line'} />
    </div>
  )
}

export default DashboardChart
