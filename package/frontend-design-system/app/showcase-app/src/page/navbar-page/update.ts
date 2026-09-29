import * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [navbarModel, navbarCmd] = DsNavbar.init()
  return [
    {
      showCode: true,
      navbarModel,
    },
    navbarCmd.map((subMsg) => ({ _tag: 'NavbarMsg' as const, subMsg })),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]
    case 'NavbarMsg': {
      const [nextNavModel, cmd] = DsNavbar.update(msg.subMsg)(model.navbarModel)
      return [
        { ...model, navbarModel: nextNavModel },
        cmd.map((subMsg) => ({ _tag: 'NavbarMsg' as const, subMsg })),
      ]
    }
  }
}
