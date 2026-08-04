import type * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'

export type Model = {
  showCode: boolean
  navbarModel: DsNavbar.Model
}

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'NavbarMsg'; subMsg: DsNavbar.Msg }
