export const byteFormatter = (usage: number) => {
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
