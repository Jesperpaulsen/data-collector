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
}
