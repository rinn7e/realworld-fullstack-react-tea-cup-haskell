import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (isOpen = false): [Model, Cmd<Msg>] => [
  { isOpen },
  Cmd.none(),
]

export const update =
  (msg: Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'NoOp':
        return [model, Cmd.none()]

      case 'Toggle':
        return [{ isOpen: !model.isOpen }, Cmd.none()]

      case 'Open':
        return [{ isOpen: true }, Cmd.none()]

      case 'Close':
        return [{ isOpen: false }, Cmd.none()]
    }
  }
