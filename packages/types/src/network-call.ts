export interface NetworkCall {
  uid?: string
  type: XMLHttpRequestResponseType
  size?: number | null
  data?: any
  url: string
  headers: string
  timestamp: number
  manuallyCalculated?: boolean
  hostOrigin: string
  hostPathname: string
  userId?: string
}
