import { FunctionComponent } from 'preact'
import UsageDisplay from './UsageDisplay'
import Button from '../common/Button'
import { SHOW_USAGE } from '../../config'

const Dashboard: FunctionComponent = () => {
  return (
    <div className="w-full h-screen">
      {SHOW_USAGE ? (
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
      ) : (
        <div className="flex flex-col justify-center items-center text-center h-2/3">
          <div className="text-3xl text-green-800">
            Your usage is currently beeing collected.
          </div>
          <div className="text-xl">
            In the next round you will be able to see your usage in real time.
          </div>
          <div className="text-sm pt-10">
            You can't see your usage now because we want to see if your habits
            change when you get access to see your pollution. Thanks for
            participating.
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
