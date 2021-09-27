import { FunctionComponent } from 'preact';
import { useContext, useMemo, useState } from 'preact/hooks';
import { UsageContext } from '../../contexts/UsageContext';
import { UserContext } from '../../contexts/UserContext';

interface UsageDisplay {
  usageString: string
  usageDescription: string
}

const Dashboard: FunctionComponent = () => {
  const { currentUser } = useContext(UserContext);
  const { usage } = useContext(UsageContext)
  const [usageToDisplay, setUsageToDisplay] = useState<UsageDisplay[]>([])
  

  useMemo(() => {
    const getUsageDescription = (usageKey: keyof typeof usage) => {
      switch(usageKey) {
        case 'usageToday':
          return 'Amount of data collected today'
        case 'usageLast7Days':
          return 'Amount of data collected last seven days'
        case 'totalUsage':
          return 'Total amount of data collected'
      }
    }

    const getUsageString = (usage: number) => {
      const kbyte = 1024
      const mbyte = 1024 * kbyte
      const gbyte = 1024 * mbyte

      let formatedUsage = 0
      let usageUnit: 'KB | MB | GB' = 'KB'

      if (usage > kbyte * mbyte) {
        formatedUsage = (usage / gbyte).toFixed(2)
        usageUnit = 'GB'
      } else if (usage > kbyte * kbyte) {
        formatedUsage = (usage / mbyte).toFixed(2)
        usageUnit = 'MB'
      } else {
        formatedUsage = (usage / kbyte).toFixed(2)
        usageUnit = 'KB'
      }

      return `${formatedUsage} ${usageUnit}`
    }

    const res: UsageDisplay[] = []
    for (const [key, value] of Object.entries(usage)) {
      res.push({ usageDescription: getUsageDescription(key), usageString: getUsageString(value) })
    }
    setUsageToDisplay(res)
  }, [usage])

  return (
    <div className="w-full h-screen relative">
      <div className="text-2xl pt-10 pl-5">
        <div>Good evening, {currentUser?.name}!</div>
        <div>We're currently collecting your data.</div>
      </div>
      <div className="bottom-1/2 absolute w-full">
        <div className="flex justify-center">
          {usageToDisplay.map((usage) => (
            <div className="text-center px-3">
              <div className="text-4xl font-medium">{usage.usageString}</div>
              <div className="text-xs font-light">{usage.usageDescription}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
