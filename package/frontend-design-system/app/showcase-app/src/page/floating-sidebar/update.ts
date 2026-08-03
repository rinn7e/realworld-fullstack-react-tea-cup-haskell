import * as DsFloatingSidebar from '@rinn7e/realworld-design-system/component/floating-sidebar'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [sidebarModel, sidebarCmd] = DsFloatingSidebar.init()
  return [
    {
      showCode: true,
      placement: 'left',
      sidebar: sidebarModel,
    },
    sidebarCmd.map((subMsg): Msg => ({ _tag: 'SidebarMsg', subMsg })),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]
    case 'SetPlacement':
      return [{ ...model, placement: msg.placement }, Cmd.none()]
    case 'OpenSidebar': {
      const [sidebarModel, sidebarCmd] = DsFloatingSidebar.update({
        _tag: 'Toggle',
        open: true,
      })(model.sidebar)
      return [
        { ...model, sidebar: sidebarModel },
        sidebarCmd.map((subMsg): Msg => ({ _tag: 'SidebarMsg', subMsg })),
      ]
    }
    case 'SidebarMsg': {
      const [sidebarModel, sidebarCmd] = DsFloatingSidebar.update(msg.subMsg)(
        model.sidebar,
      )
      return [
        { ...model, sidebar: sidebarModel },
        sidebarCmd.map((subMsg): Msg => ({ _tag: 'SidebarMsg', subMsg })),
      ]
    }
  }
}
