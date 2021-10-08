import { FieldValue } from 'firebase/firestore'

export default interface User {
  name: string
  email: string
  uid: string
  role: 'user' | 'admin'
  totalSize: FieldValue
  totalCO2: FieldValue
  totalKWH: FieldValue
  numberOfCalls: FieldValue
}
