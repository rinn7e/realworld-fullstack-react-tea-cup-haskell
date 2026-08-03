import type * as DsSidebar from '@rinn7e/realworld-design-system/component/sidebar'

export type Model = {
  showCode: boolean
  placement: 'left' | 'right'
  sidebar: DsSidebar.Model
}

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'SetPlacement'; placement: 'left' | 'right' }
  | { _tag: 'OpenSidebar' }
  | { _tag: 'SidebarMsg'; subMsg: DsSidebar.Msg }
