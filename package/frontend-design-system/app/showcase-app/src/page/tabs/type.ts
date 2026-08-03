import { Tabs as DsTabs } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  tabsModel: DsTabs.Model
}

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'TabsMsg'; subMsg: DsTabs.Msg }
