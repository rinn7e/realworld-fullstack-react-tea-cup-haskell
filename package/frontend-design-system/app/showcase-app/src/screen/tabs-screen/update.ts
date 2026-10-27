import { Tabs as DsTabs } from '@rinn7e/realworld-design-system'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [tabsModel] = DsTabs.init('feed')
  return [{ showCode: true, tabsModel }, Cmd.none()]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]
    case 'TabsMsg': {
      const [tabsModel, cmd] = DsTabs.update(msg.subMsg)(model.tabsModel)
      return [
        { ...model, tabsModel },
        cmd.map((subMsg: DsTabs.Msg) => ({ _tag: 'TabsMsg', subMsg })),
      ]
    }
  }
}
