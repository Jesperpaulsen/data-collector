export const co2Formatter = (usage: number) => {
  const gram = 1
  const kg = 1000 * gram

  let formatedUsage = '0'
  let usageUnit: 'g' | 'Kg' = 'g'

  if (usage > kg) {
    formatedUsage = (usage / kg).toFixed(2)
    usageUnit = 'Kg'
  } else {
    formatedUsage = usage.toFixed(2)
    usageUnit = 'g'
  }

  return `${formatedUsage} ${usageUnit}`
}
