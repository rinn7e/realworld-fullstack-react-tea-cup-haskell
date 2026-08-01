import type {
  Dropdown,
  Modal,
  Navbar,
  Pagination,
  Panel,
  Tabs,
} from '@rinn7e/frontend-design-system'

export type SectionCategory =
  | 'elements'
  | 'components'
  | 'form'
  | 'layout'
  | 'grid'

export type ComponentItem =
  // Elements
  | 'block'
  | 'box'
  | 'button'
  | 'content'
  | 'delete'
  | 'icon'
  | 'image'
  | 'notification'
  | 'progress'
  | 'table'
  | 'tag'
  | 'title'
  // Components
  | 'breadcrumb'
  | 'card'
  | 'dropdown'
  | 'menu'
  | 'message'
  | 'modal'
  | 'navbar'
  | 'pagination'
  | 'panel'
  | 'tabs'
  // Form
  | 'field'
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file'
  // Layout & Grid
  | 'container'
  | 'hero'
  | 'section'
  | 'level'
  | 'media-object'
  | 'footer'
  | 'columns'

export type Model = {
  activeCategory: SectionCategory
  activeComponent: ComponentItem
  searchQuery: string
  showCode: boolean
  // Component Interactive States
  dropdownModel: Dropdown.Model
  modalModel: Modal.Model
  navbarModel: Navbar.Model
  paginationModel: Pagination.Model
  panelModel: Panel.Model
  tabsModel: Tabs.Model
  // Form Inputs
  inputValue: string
  textareaValue: string
  selectValue: string
  checkboxChecked: boolean
  radioValue: string
  fileName: string
}

export type Msg =
  | { _tag: 'SelectCategory'; category: SectionCategory }
  | { _tag: 'SelectComponent'; component: ComponentItem }
  | { _tag: 'UpdateSearch'; query: string }
  | { _tag: 'ToggleShowCode' }
  // Sub-component Msgs
  | { _tag: 'DropdownMsg'; subMsg: Dropdown.Msg }
  | { _tag: 'ModalMsg'; subMsg: Modal.Msg }
  | { _tag: 'NavbarMsg'; subMsg: Navbar.Msg }
  | { _tag: 'PaginationMsg'; subMsg: Pagination.Msg }
  | { _tag: 'PanelMsg'; subMsg: Panel.Msg }
  | { _tag: 'TabsMsg'; subMsg: Tabs.Msg }
  // Form Inputs
  | { _tag: 'UpdateInput'; value: string }
  | { _tag: 'UpdateTextarea'; value: string }
  | { _tag: 'UpdateSelect'; value: string }
  | { _tag: 'ToggleCheckbox' }
  | { _tag: 'UpdateRadio'; value: string }
  | { _tag: 'UpdateFile'; name: string }
