import { FieldValue } from 'firebase/firestore'

export interface BaseUsageDoc {
  uid: string
  type?: any
  userId: string
  date: number
  size: FieldValue
  CO2: FieldValue
  kWh: FieldValue
  numberOfCalls: FieldValue
  numberOfCallsWithoutSize: FieldValue
  secondsActive?: FieldValue
}

export interface BaseUsageDocResponse {
  uid: string
  type?: any
  userId: string
  date: number
  size: number
  CO2: number
  kWh: number
  numberOfCalls: number
  secondsActive?: number
}
