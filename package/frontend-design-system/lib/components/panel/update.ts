import { Cmd } from 'tea-cup-fp'
import type { Model, Msg } from './type'

export const init = (
  initialTabId = 'all',
  initialSelectedId: string | null = null,
): [Model, Cmd<Msg>] => [
  { activeTabId: initialTabId, selectedItemId: initialSelectedId },
  Cmd.none(),
]

export const update =
  (msg: Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'SelectTab':
        return [{ ...model, activeTabId: msg.id }, Cmd.none()]
      case 'SelectItem':
        return [{ ...model, selectedItemId: msg.id }, Cmd.none()]
    }
  }
