export interface UsageDetails {
  size: number
  kWh: number
  CO2: number
  numberOfCalls?: number
  numberOfCallsWithoutSize?: number
  secondsActive?: number
}
