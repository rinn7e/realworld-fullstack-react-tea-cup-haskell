import { Navbar } from '@rinn7e/realworld-design-system'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [navbarModel] = Navbar.init('settings')
  return [{ showCode: true, navbarModel }, Cmd.none()]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]
    case 'NavbarMsg': {
      const [navbarModel, cmd] = Navbar.update(msg.subMsg)(model.navbarModel)
      return [
        { ...model, navbarModel },
        cmd.map((subMsg: Navbar.Msg) => ({ _tag: 'NavbarMsg', subMsg })),
      ]
    }
  }
}
