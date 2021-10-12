import { FieldValue } from 'firebase/firestore'

export interface BaseUsageDoc {
  uid: string
  type?: any
  userId: string
  date?: number
  size: FieldValue
  CO2: FieldValue
  KWH: FieldValue
  numberOfCalls: FieldValue
  numberOfCallsWithoutSize: FieldValue
}
