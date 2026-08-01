import {
  Dropdown,
  Modal,
  Navbar,
  Pagination,
  Panel,
  Tabs,
} from '@rinn7e/frontend-design-system'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [dropdownModel] = Dropdown.init('opt1')
  const [modalModel] = Modal.init(false)
  const [navbarModel] = Navbar.init('home')
  const [paginationModel] = Pagination.init(1, 5)
  const [panelModel] = Panel.init('all', 'p1')
  const [tabsModel] = Tabs.init('tab1')

  return [
    {
      activeCategory: 'elements',
      activeComponent: 'button',
      searchQuery: '',
      showCode: true,
      dropdownModel,
      modalModel,
      navbarModel,
      paginationModel,
      panelModel,
      tabsModel,
      inputValue: 'Hello RealWorld',
      textareaValue: 'Design system inspired by Bulma built with Tailwind CSS',
      selectValue: 'option1',
      checkboxChecked: true,
      radioValue: 'radio1',
      fileName: 'avatar.jpg',
    },
    Cmd.none(),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'SelectCategory':
      return [{ ...model, activeCategory: msg.category }, Cmd.none()]
    case 'SelectComponent':
      return [{ ...model, activeComponent: msg.component }, Cmd.none()]
    case 'UpdateSearch':
      return [{ ...model, searchQuery: msg.query }, Cmd.none()]
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]

    case 'DropdownMsg': {
      const [newSubModel, cmd] = Dropdown.update(msg.subMsg)(
        model.dropdownModel,
      )
      return [
        { ...model, dropdownModel: newSubModel },
        cmd.map((subMsg: Dropdown.Msg) => ({
          _tag: 'DropdownMsg' as const,
          subMsg,
        })),
      ]
    }
    case 'ModalMsg': {
      const [newSubModel, cmd] = Modal.update(msg.subMsg)(model.modalModel)
      return [
        { ...model, modalModel: newSubModel },
        cmd.map((subMsg: Modal.Msg) => ({
          _tag: 'ModalMsg' as const,
          subMsg,
        })),
      ]
    }
    case 'NavbarMsg': {
      const [newSubModel, cmd] = Navbar.update(msg.subMsg)(model.navbarModel)
      return [
        { ...model, navbarModel: newSubModel },
        cmd.map((subMsg: Navbar.Msg) => ({
          _tag: 'NavbarMsg' as const,
          subMsg,
        })),
      ]
    }
    case 'PaginationMsg': {
      const [newSubModel, cmd] = Pagination.update(msg.subMsg)(
        model.paginationModel,
      )
      return [
        { ...model, paginationModel: newSubModel },
        cmd.map((subMsg: Pagination.Msg) => ({
          _tag: 'PaginationMsg' as const,
          subMsg,
        })),
      ]
    }
    case 'PanelMsg': {
      const [newSubModel, cmd] = Panel.update(msg.subMsg)(model.panelModel)
      return [
        { ...model, panelModel: newSubModel },
        cmd.map((subMsg: Panel.Msg) => ({
          _tag: 'PanelMsg' as const,
          subMsg,
        })),
      ]
    }
    case 'TabsMsg': {
      const [newSubModel, cmd] = Tabs.update(msg.subMsg)(model.tabsModel)
      return [
        { ...model, tabsModel: newSubModel },
        cmd.map((subMsg: Tabs.Msg) => ({
          _tag: 'TabsMsg' as const,
          subMsg,
        })),
      ]
    }

    case 'UpdateInput':
      return [{ ...model, inputValue: msg.value }, Cmd.none()]
    case 'UpdateTextarea':
      return [{ ...model, textareaValue: msg.value }, Cmd.none()]
    case 'UpdateSelect':
      return [{ ...model, selectValue: msg.value }, Cmd.none()]
    case 'ToggleCheckbox':
      return [{ ...model, checkboxChecked: !model.checkboxChecked }, Cmd.none()]
    case 'UpdateRadio':
      return [{ ...model, radioValue: msg.value }, Cmd.none()]
    case 'UpdateFile':
      return [{ ...model, fileName: msg.name }, Cmd.none()]
  }
}
