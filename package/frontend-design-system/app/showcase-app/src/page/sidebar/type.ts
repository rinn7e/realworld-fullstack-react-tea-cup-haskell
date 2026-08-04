import type * as DsSidebar from '@rinn7e/realworld-design-system/component/sidebar'

export type Model = {
  showCode: boolean
  sidebar: DsSidebar.Model
}

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'SidebarMsg'; subMsg: DsSidebar.Msg }
