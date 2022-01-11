import { CountryDoc } from '../../types/country-doc'
import { HostDoc } from '../../types/host-doc'
import { UserHandler } from '../User/UserHandler'
import { UserState } from '../User/UserState'
import { UsageHandler } from './UsageHandler'

export interface UsageDetails {
  size: number
  kWh: number
  CO2: number
  numberOfCalls?: number
  numberOfCallsWithoutSize?: number
}

export interface UsageState {
  todaysUsage: UsageDetails
  totalUsage: UsageDetails
  allUsersUsageLastWeek: { [date: number]: UsageDetails }
  ownUsageLastWeek: { [date: number]: UsageDetails }
  usageByCountry?: { [uid: string]: CountryDoc }
  usageByHost?: { [uid: string]: HostDoc }
  accumulatedUsageByHost?: { [uid: string]: HostDoc }
  userState?: UserState
  userHandler?: UserHandler
  aliasMap: Map<string, string>
}

const initialUsage: UsageDetails = {
  size: 0,
  kWh: 0,
  CO2: 0
}

export const initialState: UsageState = {
  todaysUsage: initialUsage,
  totalUsage: initialUsage,
  allUsersUsageLastWeek: {},
  ownUsageLastWeek: {},
  aliasMap: new Map<string, string>()
}
