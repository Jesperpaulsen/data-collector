import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const getStartOfDateInUnix = (date: Date) => {
  const startOfDay = dayjs(date).utc().startOf('day')
  return startOfDay.unix()
}

export const getDateLimit = (numberOfDaysToSubtract: number) => {
  return dayjs()
    .utc()
    .subtract(numberOfDaysToSubtract, 'days')
    .startOf('day')
    .unix()
}

export const getCurrentTimeInUnix = () => {
  return dayjs().utc().unix()
}
