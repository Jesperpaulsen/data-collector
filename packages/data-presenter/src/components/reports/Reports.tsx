import dayjs from 'dayjs'
import { Fragment, FunctionalComponent } from 'preact'
import { useContext, useEffect, useState } from 'preact/hooks'
import { UsageContext } from '../../contexts/UsageContext'
import { UsageReport } from '../../types/UsageReport'
import CustomTable from '../common/CustomTable/CustomTable'
import Report from './Report'

const formatDate = (date: number) => {
  return dayjs.unix(date).format('DD/MM/YYYY')
}

const headers = [{ label: 'Date', value: 'date', renderMethod: formatDate }]

const Reports: FunctionalComponent = () => {
  const { reports } = useContext(UsageContext)

  const [activeReport, setActiveReport] = useState<UsageReport | undefined>()

  return (
    <Fragment>
      {activeReport && (
        <Report
          report={activeReport}
          closeReport={() => setActiveReport(undefined)}
        />
      )}
      <div onClick={() => setActiveReport(undefined)}>
        {reports.length > 0 ? (
          <CustomTable
            data={reports}
            headers={headers}
            onClick={setActiveReport}
          />
        ) : (
          <div>
            No reports have been generated for you yet. Check back tomorrow to
            get your first report.
          </div>
        )}
      </div>
    </Fragment>
  )
}

export default Reports
