import { Menu as DsMenu } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  menuModel: DsMenu.Model
}

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'MenuMsg'; subMsg: DsMenu.Msg }
