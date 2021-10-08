import { FieldValue } from 'firebase/firestore'

export default interface User {
  name: string
  email: string
  uid: string
  role: 'user' | 'admin'
  totalSize: number
  totalCO2: number
  totalKWH: number
  numberOfCalls: number
}
