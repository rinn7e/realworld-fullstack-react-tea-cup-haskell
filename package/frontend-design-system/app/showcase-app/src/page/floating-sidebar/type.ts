import type * as DsFloatingSidebar from '@rinn7e/realworld-design-system/component/floating-sidebar'

export type Model = {
  showCode: boolean
  placement: 'left' | 'right'
  sidebar: DsFloatingSidebar.Model
}

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'SetPlacement'; placement: 'left' | 'right' }
  | { _tag: 'OpenSidebar' }
  | { _tag: 'SidebarMsg'; subMsg: DsFloatingSidebar.Msg }
