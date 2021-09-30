import { FunctionalComponent } from "preact";
import { useContext, useMemo, useState } from 'preact/hooks';
import { UsageContext } from '../../contexts/UsageContext';

interface UsageDisplay {
  usageString: string
  usageDescription: string
}


const UsageDisplay: FunctionalComponent = () => {
  const { usage, totalCO2 } = useContext(UsageContext)
  const [usageToDisplay, setUsageToDisplay] = useState<UsageDisplay[]>([])
  

  useMemo(() => {
    const getUsageDescription = (usageKey: keyof typeof usage) => {
      switch(usageKey) {
        case 'usageToday':
          return 'Amount of data collected today'
        case 'usageLast7Days':
          return 'Amount of data collected the last seven days'
        case 'totalUsage':
          return 'Total amount of data collected'
      }
    }

    const getUsageString = (usage: number) => {
      const kbyte = 1024
      const mbyte = 1024 * kbyte
      const gbyte = 1024 * mbyte

      let formatedUsage = '0'
      let usageUnit: 'KB' | 'MB' | 'GB' = 'KB'

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
      res.push({ usageDescription: getUsageDescription(key as keyof typeof usage), usageString: getUsageString(value) })
    }
    setUsageToDisplay(res)
  }, [usage])

  return (
    <div>
      <div className="flex justify-center">
        {usageToDisplay.map((usage) => (
          <div className="text-center px-3">
            <div className="text-4xl font-medium">{usage.usageString}</div>
            <div className="text-xs font-light">{usage.usageDescription}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-3">
        <div className="text-center">
          <div className="text-6xl font-medium">{totalCO2.toFixed(2)}</div>
          <div className="text-xs font-light">kg CO2</div>
        </div>
      </div>
    </div>
  )
}

export default UsageDisplay