import { UserState } from '../User/UserState'

export interface UsageDetails {
  size: number
  KWH: number
  CO2: number
}

export interface UsageState {
  todaysUsage: UsageDetails
  totalUsage: UsageDetails
  userState?: UserState
}

const initialUsage: UsageDetails = {
  size: 0,
  KWH: 0,
  CO2: 0
}

export const initialState: UsageState = {
  todaysUsage: initialUsage,
  totalUsage: initialUsage
}
