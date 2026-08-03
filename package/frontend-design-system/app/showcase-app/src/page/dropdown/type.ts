import { Dropdown as DsDropdown } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  dropdownModel: DsDropdown.Model
}

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'DropdownMsg'; subMsg: DsDropdown.Msg }
