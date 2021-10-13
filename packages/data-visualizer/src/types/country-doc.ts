import { BaseUsageDocResponse } from './base-usage-doc'

export interface CountryDoc extends BaseUsageDocResponse {
  usageId: string
  countryCode: string
  countryName: string
}
