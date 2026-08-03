import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => [null, Cmd.none()]

export const update =
  (msg: Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'ClickNavItem':
        // Should be intercepted and handled by parent component
        return [model, Cmd.none()]
    }
  }
