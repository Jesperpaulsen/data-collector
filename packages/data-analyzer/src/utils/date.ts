export const getStartOfDateInUnix = (date: Date) => {
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
  const utc = convertDateToUTC(startOfDay)
  return utc.valueOf() / 1000
}

export const getDateLimit = (numberOfDaysToSubtract: number) => {
  const today = convertDateToUTC(new Date())
  today.setHours(0, 0, 0, 0)
  const dateToCompare = convertDateToUTC(new Date())
  dateToCompare.setDate(today.getDate() - numberOfDaysToSubtract)
  dateToCompare.setHours(0, 0, 0, 0)
  return dateToCompare.valueOf() / 1000
}

export const convertDateToUTC = (date: Date) => {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
}
