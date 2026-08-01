import type {
  Dropdown,
  Menu,
  Modal,
  Navbar,
  Pagination,
  Panel,
  Tabs,
} from '@rinn7e/realworld-design-system'

import type { ComponentItem } from '../../route/type'

export type Model = {
  component: ComponentItem
  showCode: boolean
  inputValue: string
  textareaValue: string
  selectValue: string
  checkboxChecked: boolean
  dropdownModel: Dropdown.Model
  modalModel: Modal.Model
  navbarModel: Navbar.Model
  paginationModel: Pagination.Model
  panelModel: Panel.Model
  tabsModel: Tabs.Model
  menuModel: Menu.Model
}

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'UpdateInput'; value: string }
  | { _tag: 'UpdateTextarea'; value: string }
  | { _tag: 'UpdateSelect'; value: string }
  | { _tag: 'ToggleCheckbox' }
  | { _tag: 'DropdownMsg'; subMsg: Dropdown.Msg }
  | { _tag: 'ModalMsg'; subMsg: Modal.Msg }
  | { _tag: 'NavbarMsg'; subMsg: Navbar.Msg }
  | { _tag: 'PaginationMsg'; subMsg: Pagination.Msg }
  | { _tag: 'PanelMsg'; subMsg: Panel.Msg }
  | { _tag: 'TabsMsg'; subMsg: Tabs.Msg }
  | { _tag: 'MenuMsg'; subMsg: Menu.Msg }
