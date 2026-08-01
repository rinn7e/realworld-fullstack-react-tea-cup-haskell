import {
  Dropdown,
  Menu,
  Modal,
  Navbar,
  Pagination,
  Panel,
  Tabs,
} from '@rinn7e/realworld-design-system'
import { Cmd } from 'tea-cup-fp'

import type { ComponentItem } from '../../route/type'
import type { Model, Msg } from './type'

export const init = (component: ComponentItem): [Model, Cmd<Msg>] => {
  const [dropdownModel] = Dropdown.init()
  const [modalModel] = Modal.init()
  const [navbarModel] = Navbar.init()
  const [paginationModel] = Pagination.init(1, 5)
  const [panelModel] = Panel.init('all', 'p1')
  const [tabsModel] = Tabs.init('feed')
  const [menuModel] = Menu.init(component)

  return [
    {
      component,
      showCode: true,
      inputValue: '',
      textareaValue: '',
      selectValue: 'option1',
      checkboxChecked: false,
      dropdownModel,
      modalModel,
      navbarModel,
      paginationModel,
      panelModel,
      tabsModel,
      menuModel,
    },
    Cmd.none(),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]

    case 'UpdateInput':
      return [{ ...model, inputValue: msg.value }, Cmd.none()]

    case 'UpdateTextarea':
      return [{ ...model, textareaValue: msg.value }, Cmd.none()]

    case 'UpdateSelect':
      return [{ ...model, selectValue: msg.value }, Cmd.none()]

    case 'ToggleCheckbox':
      return [{ ...model, checkboxChecked: !model.checkboxChecked }, Cmd.none()]

    case 'DropdownMsg': {
      const [dropdownModel, cmd] = Dropdown.update(msg.subMsg)(
        model.dropdownModel,
      )
      return [
        { ...model, dropdownModel },
        cmd.map((subMsg: Dropdown.Msg) => ({ _tag: 'DropdownMsg', subMsg })),
      ]
    }

    case 'ModalMsg': {
      const [modalModel, cmd] = Modal.update(msg.subMsg)(model.modalModel)
      return [
        { ...model, modalModel },
        cmd.map((subMsg: Modal.Msg) => ({ _tag: 'ModalMsg', subMsg })),
      ]
    }

    case 'NavbarMsg': {
      const [navbarModel, cmd] = Navbar.update(msg.subMsg)(model.navbarModel)
      return [
        { ...model, navbarModel },
        cmd.map((subMsg: Navbar.Msg) => ({ _tag: 'NavbarMsg', subMsg })),
      ]
    }

    case 'PaginationMsg': {
      const [paginationModel, cmd] = Pagination.update(msg.subMsg)(
        model.paginationModel,
      )
      return [
        { ...model, paginationModel },
        cmd.map((subMsg: Pagination.Msg) => ({
          _tag: 'PaginationMsg',
          subMsg,
        })),
      ]
    }

    case 'PanelMsg': {
      const [panelModel, cmd] = Panel.update(msg.subMsg)(model.panelModel)
      return [
        { ...model, panelModel },
        cmd.map((subMsg: Panel.Msg) => ({ _tag: 'PanelMsg', subMsg })),
      ]
    }

    case 'TabsMsg': {
      const [tabsModel, cmd] = Tabs.update(msg.subMsg)(model.tabsModel)
      return [
        { ...model, tabsModel },
        cmd.map((subMsg: Tabs.Msg) => ({ _tag: 'TabsMsg', subMsg })),
      ]
    }

    case 'MenuMsg': {
      const [menuModel, cmd] = Menu.update(msg.subMsg)(model.menuModel)
      return [
        { ...model, menuModel },
        cmd.map((subMsg: Menu.Msg) => ({ _tag: 'MenuMsg', subMsg })),
      ]
    }
  }
}
