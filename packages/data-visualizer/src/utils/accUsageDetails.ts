import { UsageDetails } from '../contexts/Usage/UsageState'

export const accUsageDetails = <T>(usage: UsageDetails, usageObject: T) => {
  const res = { ...usageObject }
  for (const [key, value] of Object.entries(usage)) {
    res[key] = (value || 0) + (res[key] || 0)
  }
  return res
}
