import { Dropdown } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  dropdownModel: Dropdown.Model
}

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'DropdownMsg'; subMsg: Dropdown.Msg }
