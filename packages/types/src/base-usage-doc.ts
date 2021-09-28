import { USAGE_TYPES } from '.'

export interface BaseUsageDoc {
  uid: string
  type?: USAGE_TYPES
  userId: string
  date: number
  size: any
  CO2: any
  numberOfCallsWithoutSize: any
}
