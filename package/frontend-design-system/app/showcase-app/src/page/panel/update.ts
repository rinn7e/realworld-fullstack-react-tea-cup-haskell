import { Panel as DsPanel } from '@rinn7e/realworld-design-system'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [panelModel] = DsPanel.init('all', 'p1')
  return [{ showCode: true, panelModel }, Cmd.none()]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]
    case 'PanelMsg': {
      const [panelModel, cmd] = DsPanel.update(msg.subMsg)(model.panelModel)
      return [
        { ...model, panelModel },
        cmd.map((subMsg: DsPanel.Msg) => ({ _tag: 'PanelMsg', subMsg })),
      ]
    }
  }
}
