import * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import * as DsSidebar from '@rinn7e/realworld-design-system/component/sidebar'
import type { NavItemData } from '@rinn7e/realworld-design-system/type/nav-item'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { navItemDestination } from '@/common/constant/menu'
import {
  initScreenModel,
  navigationMsgHandler,
} from '@/handler/navigation-handler'
import * as BlockScreen from '@/screen/block-screen'
import * as BoxScreen from '@/screen/box-screen'
import * as BreadcrumbScreen from '@/screen/breadcrumb-screen'
import * as ButtonScreen from '@/screen/button-screen'
import * as CardScreen from '@/screen/card-screen'
import * as CheckboxScreen from '@/screen/checkbox-screen'
import * as ColumnsScreen from '@/screen/columns-screen'
import * as ContainerScreen from '@/screen/container-screen'
import * as ContentScreen from '@/screen/content-screen'
import * as DeleteScreen from '@/screen/delete-screen'
import * as DotLoadingScreen from '@/screen/dot-loading-screen'
import * as DropdownScreen from '@/screen/dropdown-screen'
import * as FieldScreen from '@/screen/field-screen'
import * as FileScreen from '@/screen/file-screen'
import * as FloatingSidebarScreen from '@/screen/floating-sidebar-screen'
import * as FooterScreen from '@/screen/footer-screen'
import * as HeroScreen from '@/screen/hero-screen'
import * as HomeScreen from '@/screen/home-screen'
import * as IconScreen from '@/screen/icon-screen'
import * as ImageScreen from '@/screen/image-screen'
import * as InputScreen from '@/screen/input-screen'
import * as LevelScreen from '@/screen/level-screen'
import * as MediaObjectScreen from '@/screen/media-object-screen'
import * as MenuScreen from '@/screen/menu-screen'
import * as MessageScreen from '@/screen/message-screen'
import * as ModalScreen from '@/screen/modal-screen'
import * as NavbarScreen from '@/screen/navbar-screen'
import * as NotFoundScreen from '@/screen/not-found-screen'
import * as NotificationScreen from '@/screen/notification-screen'
import * as PaginationScreen from '@/screen/pagination-screen'
import * as PanelScreen from '@/screen/panel-screen'
import * as PopoverScreen from '@/screen/popover-screen'
import * as ProgressScreen from '@/screen/progress-screen'
import * as RadioScreen from '@/screen/radio-screen'
import * as SectionScreen from '@/screen/section-screen'
import * as SelectScreen from '@/screen/select-screen'
import * as SidebarScreen from '@/screen/sidebar-screen'
import * as TableScreen from '@/screen/table-screen'
import * as TabsScreen from '@/screen/tabs-screen'
import * as TagScreen from '@/screen/tag-screen'
import * as TextareaScreen from '@/screen/textarea-screen'
import * as TitleScreen from '@/screen/title-screen'
import { loadColorScheme, setColorSchemeCmd } from '@/theme/util'
import { bootDestinationOf } from '@/util'

import { type Model, type Msg } from './type'

// Nav items open the destination of their key, the same one their href
// spells (`navItemDestination`)
const navItemHandler =
  (item: NavItemData) =>
  (model: Model): [Model, Cmd<Msg>] =>
    pipe(
      navItemDestination(item.key),
      O.fold(
        (): [Model, Cmd<Msg>] => [model, Cmd.none()],
        (destination) =>
          navigationMsgHandler({ _tag: 'Navigate', destination }, model),
      ),
    )

const sidebarMsgHandler =
  (msg: DsSidebar.Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const [sidebarModel, sidebarCmd] = DsSidebar.update(msg)(model.sidebarModel)
    const updatedModel = { ...model, sidebarModel }
    const subCmd = sidebarCmd.map((subMsg) => ({
      _tag: 'SidebarMsg' as const,
      subMsg,
    }))
    if (msg._tag === 'ClickItem') {
      const [navigatedModel, navigationCmd] = navItemHandler(msg.item)(
        updatedModel,
      )
      return [navigatedModel, Cmd.batch([subCmd, navigationCmd])]
    } else {
      return [updatedModel, subCmd]
    }
  }

const rightSidebarMsgHandler =
  (msg: DsSidebar.Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const [rightSidebarModel, sidebarCmd] = DsSidebar.update(msg)(
      model.rightSidebarModel,
    )
    const updatedModel = { ...model, rightSidebarModel }
    const subCmd = sidebarCmd.map((subMsg) => ({
      _tag: 'RightSidebarMsg' as const,
      subMsg,
    }))
    if (msg._tag === 'ClickItem') {
      const [navigatedModel, navigationCmd] = navItemHandler(msg.item)(
        updatedModel,
      )
      return [navigatedModel, Cmd.batch([subCmd, navigationCmd])]
    } else {
      return [updatedModel, subCmd]
    }
  }

const topNavbarMsgHandler =
  (msg: DsNavbar.Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const [topNavbarModel, navbarCmd] = DsNavbar.update(msg)(
      model.topNavbarModel,
    )
    const updatedModel = { ...model, topNavbarModel }
    if (msg._tag === 'ClickNavItem') {
      if (msg.item.key === 'theme-light') {
        return [
          { ...updatedModel, colorScheme: 'light' },
          setColorSchemeCmd('light'),
        ]
      } else if (msg.item.key === 'theme-dark') {
        return [
          { ...updatedModel, colorScheme: 'dark' },
          setColorSchemeCmd('dark'),
        ]
      } else if (msg.item.key === 'theme-auto') {
        return [
          { ...updatedModel, colorScheme: 'auto' },
          setColorSchemeCmd('auto'),
        ]
      } else {
        return navItemHandler(msg.item)(updatedModel)
      }
    } else {
      return [
        updatedModel,
        navbarCmd.map((subMsg) => ({ _tag: 'TopNavbarMsg' as const, subMsg })),
      ]
    }
  }

export const init = (location: Location): [Model, Cmd<Msg>] => {
  // No guard: the boot opens the destination of the URL as it is, so its
  // URL needs no correction
  const [screenModel, screenCmd] = initScreenModel(bootDestinationOf(location))
  const [sidebarModel, sidebarCmd] = DsSidebar.init(false)
  const [rightSidebarModel, rightSidebarCmd] = DsSidebar.init(false)
  const [topNavbarModel, topNavbarCmd] = DsNavbar.init()
  const colorScheme = loadColorScheme()

  const model: Model = {
    screenModel,
    searchQuery: '',
    sidebarModel,
    rightSidebarModel,
    topNavbarModel,
    colorScheme,
    isThemeMenuOpen: false,
  }

  return [
    model,
    Cmd.batch([
      sidebarCmd.map((subMsg) => ({ _tag: 'SidebarMsg' as const, subMsg })),
      rightSidebarCmd.map((subMsg) => ({
        _tag: 'RightSidebarMsg' as const,
        subMsg,
      })),
      topNavbarCmd.map((subMsg) => ({
        _tag: 'TopNavbarMsg' as const,
        subMsg,
      })),
      screenCmd,
      setColorSchemeCmd(colorScheme),
    ]),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'NoOp':
      return [model, Cmd.none()]

    case 'SetColorScheme': {
      return [
        { ...model, colorScheme: msg.scheme, isThemeMenuOpen: false },
        setColorSchemeCmd(msg.scheme),
      ]
    }

    case 'ToggleThemeMenu':
      return [{ ...model, isThemeMenuOpen: !model.isThemeMenuOpen }, Cmd.none()]

    case 'CloseThemeMenu':
      return [{ ...model, isThemeMenuOpen: false }, Cmd.none()]

    case 'Init':
      return init(msg.location)

    case 'NavigationMsg':
      return navigationMsgHandler(msg.subMsg, model)

    case 'UpdateSearch':
      return [{ ...model, searchQuery: msg.query }, Cmd.none()]

    case 'HomeScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'HomeScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [homeModel, cmd] = HomeScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'HomeScreenModel', model: homeModel },
          },
          cmd.map((subMsg) => ({ _tag: 'HomeScreenMsg', subMsg })),
        ]
      }
    }

    case 'BlockScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'BlockScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = BlockScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'BlockScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'BlockScreenMsg', subMsg })),
        ]
      }
    }

    case 'BoxScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'BoxScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = BoxScreen.update(msg.subMsg, screenModel.model)
        return [
          {
            ...model,
            screenModel: { _tag: 'BoxScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'BoxScreenMsg', subMsg })),
        ]
      }
    }

    case 'ButtonScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'ButtonScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ButtonScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'ButtonScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'ButtonScreenMsg', subMsg })),
        ]
      }
    }

    case 'ContentScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'ContentScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ContentScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'ContentScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'ContentScreenMsg', subMsg })),
        ]
      }
    }

    case 'DeleteScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'DeleteScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = DeleteScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'DeleteScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'DeleteScreenMsg', subMsg })),
        ]
      }
    }

    case 'IconScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'IconScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = IconScreen.update(msg.subMsg, screenModel.model)
        return [
          {
            ...model,
            screenModel: { _tag: 'IconScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'IconScreenMsg', subMsg })),
        ]
      }
    }

    case 'ImageScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'ImageScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ImageScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'ImageScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'ImageScreenMsg', subMsg })),
        ]
      }
    }

    case 'NotificationScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'NotificationScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = NotificationScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'NotificationScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'NotificationScreenMsg', subMsg })),
        ]
      }
    }

    case 'ProgressScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'ProgressScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ProgressScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'ProgressScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'ProgressScreenMsg', subMsg })),
        ]
      }
    }

    case 'TableScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'TableScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = TableScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'TableScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'TableScreenMsg', subMsg })),
        ]
      }
    }

    case 'TagScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'TagScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = TagScreen.update(msg.subMsg, screenModel.model)
        return [
          {
            ...model,
            screenModel: { _tag: 'TagScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'TagScreenMsg', subMsg })),
        ]
      }
    }

    case 'TitleScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'TitleScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = TitleScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'TitleScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'TitleScreenMsg', subMsg })),
        ]
      }
    }

    case 'BreadcrumbScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'BreadcrumbScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = BreadcrumbScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'BreadcrumbScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'BreadcrumbScreenMsg', subMsg })),
        ]
      }
    }

    case 'CardScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'CardScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = CardScreen.update(msg.subMsg, screenModel.model)
        return [
          {
            ...model,
            screenModel: { _tag: 'CardScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'CardScreenMsg', subMsg })),
        ]
      }
    }

    case 'DropdownScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'DropdownScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = DropdownScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'DropdownScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'DropdownScreenMsg', subMsg })),
        ]
      }
    }

    case 'MenuScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'MenuScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = MenuScreen.update(msg.subMsg, screenModel.model)
        return [
          {
            ...model,
            screenModel: { _tag: 'MenuScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'MenuScreenMsg', subMsg })),
        ]
      }
    }

    case 'MessageScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'MessageScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = MessageScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'MessageScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'MessageScreenMsg', subMsg })),
        ]
      }
    }

    case 'ModalScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'ModalScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ModalScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'ModalScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'ModalScreenMsg', subMsg })),
        ]
      }
    }

    case 'NavbarScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'NavbarScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = NavbarScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'NavbarScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'NavbarScreenMsg', subMsg })),
        ]
      }
    }

    case 'FloatingSidebarScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'FloatingSidebarScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = FloatingSidebarScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: {
              _tag: 'FloatingSidebarScreenModel',
              model: subModel,
            },
          },
          cmd.map((subMsg) => ({ _tag: 'FloatingSidebarScreenMsg', subMsg })),
        ]
      }
    }

    case 'SidebarScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'SidebarScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = SidebarScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'SidebarScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'SidebarScreenMsg', subMsg })),
        ]
      }
    }

    case 'PaginationScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'PaginationScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = PaginationScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'PaginationScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'PaginationScreenMsg', subMsg })),
        ]
      }
    }

    case 'PanelScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'PanelScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = PanelScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'PanelScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'PanelScreenMsg', subMsg })),
        ]
      }
    }

    case 'PopoverScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'PopoverScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = PopoverScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'PopoverScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'PopoverScreenMsg', subMsg })),
        ]
      }
    }

    case 'TabsScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'TabsScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = TabsScreen.update(msg.subMsg, screenModel.model)
        return [
          {
            ...model,
            screenModel: { _tag: 'TabsScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'TabsScreenMsg', subMsg })),
        ]
      }
    }

    case 'FieldScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'FieldScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = FieldScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'FieldScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'FieldScreenMsg', subMsg })),
        ]
      }
    }

    case 'InputScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'InputScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = InputScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'InputScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'InputScreenMsg', subMsg })),
        ]
      }
    }

    case 'TextareaScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'TextareaScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = TextareaScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'TextareaScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'TextareaScreenMsg', subMsg })),
        ]
      }
    }

    case 'SelectScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'SelectScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = SelectScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'SelectScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'SelectScreenMsg', subMsg })),
        ]
      }
    }

    case 'CheckboxScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'CheckboxScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = CheckboxScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'CheckboxScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'CheckboxScreenMsg', subMsg })),
        ]
      }
    }

    case 'RadioScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'RadioScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = RadioScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'RadioScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'RadioScreenMsg', subMsg })),
        ]
      }
    }

    case 'FileScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'FileScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = FileScreen.update(msg.subMsg, screenModel.model)
        return [
          {
            ...model,
            screenModel: { _tag: 'FileScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'FileScreenMsg', subMsg })),
        ]
      }
    }

    case 'ContainerScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'ContainerScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ContainerScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'ContainerScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'ContainerScreenMsg', subMsg })),
        ]
      }
    }

    case 'HeroScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'HeroScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = HeroScreen.update(msg.subMsg, screenModel.model)
        return [
          {
            ...model,
            screenModel: { _tag: 'HeroScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'HeroScreenMsg', subMsg })),
        ]
      }
    }

    case 'SectionScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'SectionScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = SectionScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'SectionScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'SectionScreenMsg', subMsg })),
        ]
      }
    }

    case 'LevelScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'LevelScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = LevelScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'LevelScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'LevelScreenMsg', subMsg })),
        ]
      }
    }

    case 'MediaObjectScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'MediaObjectScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = MediaObjectScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'MediaObjectScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'MediaObjectScreenMsg', subMsg })),
        ]
      }
    }

    case 'FooterScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'FooterScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = FooterScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'FooterScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'FooterScreenMsg', subMsg })),
        ]
      }
    }

    case 'ColumnsScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'ColumnsScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ColumnsScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'ColumnsScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'ColumnsScreenMsg', subMsg })),
        ]
      }
    }

    case 'DotLoadingScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'DotLoadingScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = DotLoadingScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'DotLoadingScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'DotLoadingScreenMsg', subMsg })),
        ]
      }
    }

    case 'NotFoundScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag !== 'NotFoundScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = NotFoundScreen.update(
          msg.subMsg,
          screenModel.model,
        )
        return [
          {
            ...model,
            screenModel: { _tag: 'NotFoundScreenModel', model: subModel },
          },
          cmd.map((subMsg) => ({ _tag: 'NotFoundScreenMsg', subMsg })),
        ]
      }
    }

    case 'SidebarMsg':
      return sidebarMsgHandler(msg.subMsg)(model)

    case 'RightSidebarMsg':
      return rightSidebarMsgHandler(msg.subMsg)(model)

    case 'TopNavbarMsg':
      return topNavbarMsgHandler(msg.subMsg)(model)
  }
}
