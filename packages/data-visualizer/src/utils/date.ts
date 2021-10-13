export const getStartOfDateInUnix = (date: Date) => {
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
  return startOfDay.valueOf() / 1000
}

export const getDateLimit = (numberOfDaysToSubtract: number) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dateToCompare = new Date()
  dateToCompare.setDate(today.getDate() - numberOfDaysToSubtract)
  dateToCompare.setHours(0, 0, 0, 0)
  return dateToCompare.valueOf() / 1000
}
