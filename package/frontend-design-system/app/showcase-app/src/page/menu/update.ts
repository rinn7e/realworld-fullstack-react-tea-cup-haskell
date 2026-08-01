import { Menu } from '@rinn7e/realworld-design-system'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [menuModel] = Menu.init('menu')
  return [{ showCode: true, menuModel }, Cmd.none()]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]
    case 'MenuMsg': {
      const [menuModel, cmd] = Menu.update(msg.subMsg)(model.menuModel)
      return [
        { ...model, menuModel },
        cmd.map((subMsg: Menu.Msg) => ({ _tag: 'MenuMsg', subMsg })),
      ]
    }
  }
}
