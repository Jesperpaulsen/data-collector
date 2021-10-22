import { FieldValue } from 'firebase/firestore'

export interface HostToCountry {
  uid: string
  userId: string
  countryCode: string
  countryName: string
  hostOrigin: string
  size: FieldValue
  CO2: FieldValue
  kWh: FieldValue
  numberOfCalls: FieldValue
  numberOfCallsWithoutSize: FieldValue
}
