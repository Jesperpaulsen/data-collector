import { FieldValue } from 'firebase/firestore'

export interface BaseUsageDoc {
  uid: string
  userId: string
  date: number
  size: number
  CO2: number
  KWH: number
  numberOfCalls: number
  numberOfCallsWithoutSize: number
}
