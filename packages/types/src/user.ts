export interface User {
  email: string
  name: string
  uid: string
  role: 'user' | 'admin'
  totalSize: any
  totalCO2: any
}
