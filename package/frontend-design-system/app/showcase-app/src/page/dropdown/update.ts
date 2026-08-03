import { Dropdown as DsDropdown } from '@rinn7e/realworld-design-system'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [dropdownModel] = DsDropdown.init()
  return [{ showCode: true, dropdownModel }, Cmd.none()]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]
    case 'DropdownMsg': {
      const [dropdownModel, cmd] = DsDropdown.update(msg.subMsg)(
        model.dropdownModel,
      )
      return [
        { ...model, dropdownModel },
        cmd.map((subMsg: DsDropdown.Msg) => ({ _tag: 'DropdownMsg', subMsg })),
      ]
    }
  }
}
