import type * as Navbar from '@rinn7e/realworld-design-system/component/navbar'

export type Model = {
  showCode: boolean
}

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'NavbarMsg'; subMsg: Navbar.Msg }
