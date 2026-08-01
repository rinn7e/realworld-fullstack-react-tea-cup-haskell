import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (
  initialSelectedId: string | null = null,
): [Model, Cmd<Msg>] => [
  { isOpen: false, selectedId: initialSelectedId },
  Cmd.none(),
]

export const update =
  (msg: Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'Toggle':
        return [{ ...model, isOpen: !model.isOpen }, Cmd.none()]
      case 'Close':
        return [{ ...model, isOpen: false }, Cmd.none()]
      case 'Select':
        return [{ isOpen: false, selectedId: msg.id }, Cmd.none()]
    }
  }
