import { FieldValue } from 'firebase/firestore'

export interface User {
  name: string
  uid: string
  role: 'user' | 'admin'
  totalSize: FieldValue
  totalCO2: FieldValue
  totalkWh: FieldValue
  numberOfCalls: FieldValue
  signUpUid: string
}
