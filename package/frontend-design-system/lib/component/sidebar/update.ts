import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (initialCollapsed = false): [Model, Cmd<Msg>] => [
  { collapsed: initialCollapsed },
  Cmd.none(),
]

export const update =
  (msg: Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'ToggleCollapsed':
        return [{ ...model, collapsed: !model.collapsed }, Cmd.none()]
      case 'SetCollapsed':
        return [{ ...model, collapsed: msg.collapsed }, Cmd.none()]
      case 'ClickItem':
        return [model, Cmd.none()]
    }
  }
