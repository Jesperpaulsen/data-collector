import { FieldValue } from 'firebase/firestore'

export default interface User {
  name: string
  uid: string
  role: 'user' | 'admin'
  totalSize: number
  totalCO2: number
  totalkWh: number
  numberOfCalls: number
}
