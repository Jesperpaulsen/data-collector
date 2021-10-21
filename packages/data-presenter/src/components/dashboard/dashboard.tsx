import { FunctionComponent } from 'preact'
import UsageDisplay from './UsageDisplay'
import Button from '../common/Button'

const Dashboard: FunctionComponent = () => {
  return (
    <div className="w-full h-screen">
      <div className="w-full">
        <UsageDisplay />
        <div className="flex justify-center pt-2">
          <Button
            onClick={() =>
              window.open('https://dashboard.jesper.no', '_blank')
            }>
            Explore results
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
