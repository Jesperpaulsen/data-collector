import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const getStartOfDateInUnix = (date: Date) => {
  const startOfDay = dayjs(date).utc().startOf('day')
  return startOfDay.unix()
}
