import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => [
  { openDropdownKey: null },
  Cmd.none(),
]

export const update =
  (msg: Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'NoOp':
      case 'ClickNavItem':
        return [{ ...model, openDropdownKey: null }, Cmd.none()]

      case 'ToggleDropdown': {
        const nextKey = model.openDropdownKey === msg.key ? null : msg.key
        return [{ ...model, openDropdownKey: nextKey }, Cmd.none()]
      }

      case 'CloseDropdown': {
        return [{ ...model, openDropdownKey: null }, Cmd.none()]
      }
    }
  }
