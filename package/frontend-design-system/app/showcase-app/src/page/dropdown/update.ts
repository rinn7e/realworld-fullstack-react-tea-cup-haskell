import { Dropdown } from '@rinn7e/realworld-design-system'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [dropdownModel] = Dropdown.init()
  return [{ showCode: true, dropdownModel }, Cmd.none()]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]
    case 'DropdownMsg': {
      const [dropdownModel, cmd] = Dropdown.update(msg.subMsg)(
        model.dropdownModel,
      )
      return [
        { ...model, dropdownModel },
        cmd.map((subMsg: Dropdown.Msg) => ({ _tag: 'DropdownMsg', subMsg })),
      ]
    }
  }
}
