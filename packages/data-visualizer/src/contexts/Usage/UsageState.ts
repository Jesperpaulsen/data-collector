import { CountryDoc } from '../../types/country-doc'
import { HostDoc } from '../../types/host-doc'
import { UserHandler } from '../User/UserHandler'
import { UserState } from '../User/UserState'
import { UsageHandler } from './UsageHandler'

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
  allUsersUsageLastWeek: { [date: number]: UsageDetails }
  ownUsageLastWeek: { [date: number]: UsageDetails }
  numberOfUsers: number
  usageByCountry?: { [uid: string]: CountryDoc }
  usageByHost?: { [uid: string]: HostDoc }
  userState?: UserState
  userHandler?: UserHandler
}

const initialUsage: UsageDetails = {
  size: 0,
  KWH: 0,
  CO2: 0
}

export const initialState: UsageState = {
  todaysUsage: initialUsage,
  totalUsage: initialUsage,
  allUsersUsageLastWeek: {},
  ownUsageLastWeek: {},
  numberOfUsers: 1
}
