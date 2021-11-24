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

export const subtractSeconds = (secondsToSubtract: number) => {
  return Math.floor(
    dayjs().utc().subtract(secondsToSubtract, 'seconds').valueOf() / 100
  )
}

export const getNetworkCallTimestamp = () => {
  return Math.floor(Date.now().valueOf() / 100)
}
