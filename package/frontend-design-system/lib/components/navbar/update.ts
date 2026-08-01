import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (
  initialActiveId: string | null = null,
): [Model, Cmd<Msg>] => [
  { isBurgerOpen: false, activeId: initialActiveId },
  Cmd.none(),
]

export const update =
  (msg: Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'ToggleBurger':
        return [{ ...model, isBurgerOpen: !model.isBurgerOpen }, Cmd.none()]
      case 'SelectTab':
        return [{ isBurgerOpen: false, activeId: msg.id }, Cmd.none()]
    }
  }
