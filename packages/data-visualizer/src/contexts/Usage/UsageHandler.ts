import { GenericHandler } from '../../types/GenericHandler'

import { UsageApi } from './UsageApi'
import { UsageState } from './UsageState'

export class UsageHandler extends GenericHandler<UsageState> {
  private api = new UsageApi()
}
