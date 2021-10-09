import { CountryDoc } from '../../types/country-doc'
import { UserState } from '../User/UserState'

export interface UsageDetails {
  size: number
  KWH: number
  CO2: number
  numberOfCalls?: number
  numberOfCallsWithoutSize?: number
}

export interface UsageState {
  todaysUsage: UsageDetails
  totalUsage: UsageDetails
  usageByCountry?: { [uid: string]: CountryDoc }
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
