import { Navbar } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  navbarModel: Navbar.Model<string>
}

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'NavbarMsg'; msg: string }
