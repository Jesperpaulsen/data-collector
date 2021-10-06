import User from '../../types/User'

export interface UserState {
  currentUser?: User
  extensionInstalled: boolean
}

export const initialUserState: UserState = { extensionInstalled: false }
