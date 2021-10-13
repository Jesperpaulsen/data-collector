import { BaseUsageDocResponse } from './base-usage-doc'

export interface HostDoc extends BaseUsageDocResponse {
  usageId: string
  hostOrigin: string
}
