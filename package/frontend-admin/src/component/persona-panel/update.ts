import { Cmd } from 'tea-cup-fp'

import { personas } from './persona'
import { type Model, type Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => [
  {
    isCollapse: true,
    showDetails: false,
    currentPersona: personas.flashAg,
    hoveredAction: null,
  },
  Cmd.none(),
]

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleCollapse':
      return [
        {
          ...model,
          isCollapse: !model.isCollapse,
          hoveredAction: null, // Reset hover state on collapse
        },
        Cmd.none(),
      ]
    case 'ToggleDetails':
      return [
        {
          ...model,
          showDetails: !model.showDetails,
        },
        Cmd.none(),
      ]
    case 'SwitchPersona':
      return [
        {
          ...model,
          currentPersona: msg.persona,
          showDetails: false, // Reset details view when switching
          hoveredAction: null,
        },
        Cmd.none(),
      ]
    case 'SetHoveredAction':
      return [
        {
          ...model,
          hoveredAction: msg.action,
        },
        Cmd.none(),
      ]
    case 'NoOp':
      return [model, Cmd.none()]
  }
}
