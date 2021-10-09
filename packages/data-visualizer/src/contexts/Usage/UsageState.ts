import { CountryDoc } from '../../types/country-doc'
import { HostDoc } from '../../types/host-doc'
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
  usageByHost?: { [uid: string]: HostDoc }
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
