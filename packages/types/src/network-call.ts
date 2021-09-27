export interface NetworkCall {
  uid?: string
  type: XMLHttpRequestResponseType
  size?: number | null
  data?: any
  headers: string
  timestamp: number
  manuallyCalculated?: boolean
  hostOrigin: string
  hostPathname: string
  userId?: string
  targetOrigin?: string
  targetPathname?: string
  targetIP?: string
  fromCache?: boolean
}

export interface NetworkCallDoc {
  uid?: string
  size: any
  date: string
  hostOrigin: string
  userId: string
  country: string
  numberOfCallsWithoutSize: any
  CO2: any
}
