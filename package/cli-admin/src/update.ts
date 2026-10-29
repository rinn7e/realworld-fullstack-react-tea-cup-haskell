import { Cmd } from 'tea-cup-fp'

import { defaultDestination } from '@core/common/type/destination'
import { type Boot } from '@core/type'
import * as Core from '@core/update'

import { type Model, type Msg } from './type'

// Initialization
// ---------------------------------------------

export const preInit = (): [Model | null, Cmd<Msg>] => [
  null,
  Core.initializeCmd((boot): Msg => ({ _tag: 'Init', boot })),
]

// A terminal has no URL: the app boots on the default destination (the
// guard sends a signed out admin to the login screen)
export const init = (boot: Boot): [Model, Cmd<Msg>] => {
  const [coreModel, coreCmd] = Core.init(boot, defaultDestination())
  return [{ ...coreModel, isTyping: false }, coreCmd]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'Init':
      // Handled before the model exists (`program.tsx`)
      return [model, Cmd.none()]
    case 'SetTyping':
      return [{ ...model, isTyping: msg.isTyping }, Cmd.none()]
    case 'NavigationMsg':
      // A move closes the text field of the screen left
      return Core.update(msg, { ...model, isTyping: false })
    default:
      // The messages of the core (session, screens)
      return Core.update(msg, model)
  }
}
