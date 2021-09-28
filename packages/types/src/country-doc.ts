import { BaseUsageDoc } from './base-usage-doc'

export interface CountryDoc extends BaseUsageDoc {
  usageId: string
  country: string
}
