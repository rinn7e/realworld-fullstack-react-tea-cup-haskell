import { Tabs } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  tabsModel: Tabs.Model
}

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'TabsMsg'; subMsg: Tabs.Msg }
