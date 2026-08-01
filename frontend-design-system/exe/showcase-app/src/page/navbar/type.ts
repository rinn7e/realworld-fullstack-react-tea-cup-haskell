import { Navbar } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  navbarModel: Navbar.Model
}

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'NavbarMsg'; subMsg: Navbar.Msg }
