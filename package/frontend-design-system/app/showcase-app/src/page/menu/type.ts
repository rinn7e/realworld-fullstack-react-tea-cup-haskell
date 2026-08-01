import { Menu } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  menuModel: Menu.Model
}

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'MenuMsg'; subMsg: Menu.Msg }
