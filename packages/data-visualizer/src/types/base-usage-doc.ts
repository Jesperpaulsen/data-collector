import { FieldValue } from 'firebase/firestore'

import { USAGE_TYPES } from '.'
export interface BaseUsageDoc {
  uid: string
  type?: USAGE_TYPES
  userId: string
  date: number
  size: number
  CO2: number
  KWH: number
  numberOfCalls: number
  numberOfCallsWithoutSize: number
}
