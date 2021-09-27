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
  uid: string
  type: XMLHttpRequestResponseType
  size: number | null
  timestamp: number
  manuallyCalculated: boolean
  hostOrigin: string
  hostPathname: string
  userId: string
  targetOrigin: string | null
  targetPathname: string | null
  targetCountry: string | null
  targetIP: string | null
}
