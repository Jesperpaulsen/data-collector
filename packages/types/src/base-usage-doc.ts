import { USAGE_TYPES } from '.'
import { FieldValue } from 'firebase/firestore'
export interface BaseUsageDoc {
  uid: string
  type?: USAGE_TYPES
  userId: string
  date: number
  size: FieldValue
  CO2: FieldValue
  KWH: FieldValue
  numberOfCalls: FieldValue
  numberOfCallsWithoutSize: FieldValue
}
