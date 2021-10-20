export interface NetworkCall {
  uid?: string
  type: XMLHttpRequestResponseType
  size?: number | null
  data?: any
  headers?: string
  timestamp: number
  manuallyCalculated?: boolean
  hostOrigin: string
  hostPathname: string
  userId?: string
  targetOrigin?: string
  targetPathname?: string
  targetIP?: string
  fromCache?: boolean
  requestId?: string
  outgoingSize?: number
}

export type StrippedNetworkCall = Pick<
  NetworkCall,
  'size' | 'userId' | 'hostOrigin' | 'targetIP'
>
