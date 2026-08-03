import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (initialIsOpen = false): [Model, Cmd<Msg>] => [
  { isOpen: initialIsOpen },
  Cmd.none(),
]

export const update =
  (msg: Msg) =>
  (_model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'Open':
        return [{ isOpen: true }, Cmd.none()]
      case 'Close':
        return [{ isOpen: false }, Cmd.none()]
    }
  }
