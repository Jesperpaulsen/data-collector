export const kmFormatter = (usage: number) => {
  const meter = 1
  const km = 1000 * meter

  let formatedUsage = '0'
  let usageUnit: 'm' | 'km' = 'm'

  if (usage > km) {
    formatedUsage = (usage / km).toFixed(2)
    usageUnit = 'km'
  } else {
    formatedUsage = usage.toFixed(2)
    usageUnit = 'm'
  }

  return `${formatedUsage} ${usageUnit}`
}
