import { delayCmd } from '@rinn7e/tea-cup-prelude'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => [
  {
    status: {
      internal: null,
      state: { _tag: 'Invisible' },
    },
  },
  Cmd.none(),
]

export const update =
  (msg: Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'Toggle': {
        if (msg.open) {
          return [
            {
              ...model,
              status: { internal: null, state: { _tag: 'AnimateIn' } },
            },
            delayCmd(150, {
              _tag: 'SetState',
              state: { _tag: 'Visible' },
            }),
          ]
        } else {
          return [
            {
              ...model,
              status: {
                ...model.status,
                state: { _tag: 'AnimateOut' },
              },
            },
            delayCmd(150, {
              _tag: 'SetState',
              state: { _tag: 'Invisible' },
            }),
          ]
        }
      }
      case 'SetState':
        return [
          {
            ...model,
            status: {
              ...model.status,
              state: msg.state,
            },
          },
          Cmd.none(),
        ]
      case 'ClickItem':
        // Should be intercepted and handled by parent component
        return [
          {
            ...model,
            status: {
              ...model.status,
              state: { _tag: 'AnimateOut' },
            },
          },
          delayCmd(150, {
            _tag: 'SetState',
            state: { _tag: 'Invisible' },
          }),
        ]
    }
  }
