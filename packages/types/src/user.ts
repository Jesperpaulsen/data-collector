export interface User {
  email: string
  name: string
  uid: string
  role: 'user' | 'admin'
}
