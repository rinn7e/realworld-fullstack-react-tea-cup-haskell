import { Panel } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  panelModel: Panel.Model
}

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'PanelMsg'; subMsg: Panel.Msg }
