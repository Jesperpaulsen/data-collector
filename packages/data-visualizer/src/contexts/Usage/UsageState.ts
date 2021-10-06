export interface UsageDetails {
  gb: number
  kwh: number
  co2: number
}

export interface UsageState {
  today: UsageDetails
  total: UsageDetails
}

const initialUsage: UsageDetails = {
  gb: 0,
  kwh: 0,
  co2: 0
}

export const initialState: UsageState = {
  today: initialUsage,
  total: initialUsage
}
