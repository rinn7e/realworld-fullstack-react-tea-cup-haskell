import { Cmd } from 'tea-cup-fp'
import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => [{}, Cmd.none()]
export const update = (_msg: Msg, model: Model): [Model, Cmd<Msg>] => [
  model,
  Cmd.none(),
]
