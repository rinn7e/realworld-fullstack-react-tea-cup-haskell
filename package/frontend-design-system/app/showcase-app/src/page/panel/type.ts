import { Panel as DsPanel } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  panelModel: DsPanel.Model
}

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'PanelMsg'; subMsg: DsPanel.Msg }
