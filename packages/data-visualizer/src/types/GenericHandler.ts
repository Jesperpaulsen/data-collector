import { Mutable } from './Mutable'

export class GenericHandler<S> {
  readonly state: S
  private updateState: (state: S) => void

  constructor(intialState: S, updateState: (state: S) => void) {
    if (!intialState || !updateState) {
      throw Error(`State handler wasn't provided initialState and updateState`)
    }
    this.state = intialState
    this.updateState = updateState
  }

  setState = (newState: Partial<S>) => {
    const tmpState = { ...this.state, ...newState } as Mutable<S>
    this.updateState(tmpState)
  }

  getState = () => {
    return this.state
  }
}
