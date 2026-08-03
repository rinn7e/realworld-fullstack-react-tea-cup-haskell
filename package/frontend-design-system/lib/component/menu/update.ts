import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (
  initialActiveId: string | null = null,
): [Model, Cmd<Msg>] => [{ activeId: initialActiveId }, Cmd.none()]

export const update =
  (msg: Msg) =>
  (_model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'Select':
        return [{ activeId: msg.id }, Cmd.none()]
    }
  }
