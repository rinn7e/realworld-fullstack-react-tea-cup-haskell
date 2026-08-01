import { Cmd } from 'tea-cup-fp'
import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  return [
    {
      activeTab: 'overview',
    },
    Cmd.none(),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'SelectTab':
      return [{ ...model, activeTab: msg.tab }, Cmd.none()]
    case 'NoOp':
      return [model, Cmd.none()]
  }
}
