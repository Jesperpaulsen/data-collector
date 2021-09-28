export const getStartOfDateInUnix = (date: Date) => {
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
  return startOfDay.valueOf() / 1000
}
