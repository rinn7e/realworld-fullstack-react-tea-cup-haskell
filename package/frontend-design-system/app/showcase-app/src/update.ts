import * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import * as DsSidebar from '@rinn7e/realworld-design-system/component/sidebar'
import type { NavItemData } from '@rinn7e/realworld-design-system/type/nav-item'
import * as TeaRouter from '@rinn7e/tea-cup-router'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { type AppRoute, parsePath } from '@/common/type/route'
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

import { mkRouterConfig } from './router-config'
import { type Model, type Msg, type ScreenModel, teaRouterMsg } from './type'

export const initScreenModel = (
  newRoute: AppRoute,
): [ScreenModel, Cmd<Msg>] => {
  switch (newRoute.page._tag) {
    case 'PageHome': {
      const [homeModel, homeCmd] = HomeScreen.init()
      return [
        { _tag: 'HomeScreenModel', model: homeModel },
        homeCmd.map((subMsg) => ({ _tag: 'HomeScreenMsg', subMsg })),
      ]
    }

    case 'PageBlock': {
      const [subModel, subCmd] = BlockScreen.init()
      return [
        { _tag: 'BlockScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'BlockScreenMsg', subMsg })),
      ]
    }

    case 'PageBox': {
      const [subModel, subCmd] = BoxScreen.init()
      return [
        { _tag: 'BoxScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'BoxScreenMsg', subMsg })),
      ]
    }

    case 'PageButton': {
      const [subModel, subCmd] = ButtonScreen.init()
      return [
        { _tag: 'ButtonScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ButtonScreenMsg', subMsg })),
      ]
    }

    case 'PageContent': {
      const [subModel, subCmd] = ContentScreen.init()
      return [
        { _tag: 'ContentScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ContentScreenMsg', subMsg })),
      ]
    }

    case 'PageDelete': {
      const [subModel, subCmd] = DeleteScreen.init()
      return [
        { _tag: 'DeleteScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'DeleteScreenMsg', subMsg })),
      ]
    }

    case 'PageIcon': {
      const [subModel, subCmd] = IconScreen.init()
      return [
        { _tag: 'IconScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'IconScreenMsg', subMsg })),
      ]
    }

    case 'PageImage': {
      const [subModel, subCmd] = ImageScreen.init()
      return [
        { _tag: 'ImageScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ImageScreenMsg', subMsg })),
      ]
    }

    case 'PageNotification': {
      const [subModel, subCmd] = NotificationScreen.init()
      return [
        { _tag: 'NotificationScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'NotificationScreenMsg', subMsg })),
      ]
    }

    case 'PageProgress': {
      const [subModel, subCmd] = ProgressScreen.init()
      return [
        { _tag: 'ProgressScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ProgressScreenMsg', subMsg })),
      ]
    }

    case 'PageTable': {
      const [subModel, subCmd] = TableScreen.init()
      return [
        { _tag: 'TableScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TableScreenMsg', subMsg })),
      ]
    }

    case 'PageTag': {
      const [subModel, subCmd] = TagScreen.init()
      return [
        { _tag: 'TagScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TagScreenMsg', subMsg })),
      ]
    }

    case 'PageTitle': {
      const [subModel, subCmd] = TitleScreen.init()
      return [
        { _tag: 'TitleScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TitleScreenMsg', subMsg })),
      ]
    }

    case 'PageBreadcrumb': {
      const [subModel, subCmd] = BreadcrumbScreen.init()
      return [
        { _tag: 'BreadcrumbScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'BreadcrumbScreenMsg', subMsg })),
      ]
    }

    case 'PageCard': {
      const [subModel, subCmd] = CardScreen.init()
      return [
        { _tag: 'CardScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'CardScreenMsg', subMsg })),
      ]
    }

    case 'PageDropdown': {
      const [subModel, subCmd] = DropdownScreen.init()
      return [
        { _tag: 'DropdownScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'DropdownScreenMsg', subMsg })),
      ]
    }

    case 'PageMenu': {
      const [subModel, subCmd] = MenuScreen.init()
      return [
        { _tag: 'MenuScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'MenuScreenMsg', subMsg })),
      ]
    }

    case 'PageMessage': {
      const [subModel, subCmd] = MessageScreen.init()
      return [
        { _tag: 'MessageScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'MessageScreenMsg', subMsg })),
      ]
    }

    case 'PageModal': {
      const [subModel, subCmd] = ModalScreen.init()
      return [
        { _tag: 'ModalScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ModalScreenMsg', subMsg })),
      ]
    }

    case 'PageNavbar': {
      const [subModel, subCmd] = NavbarScreen.init()
      return [
        { _tag: 'NavbarScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'NavbarScreenMsg', subMsg })),
      ]
    }

    case 'PageFloatingSidebar': {
      const [subModel, subCmd] = FloatingSidebarScreen.init()
      return [
        { _tag: 'FloatingSidebarScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FloatingSidebarScreenMsg', subMsg })),
      ]
    }

    case 'PageSidebar': {
      const [subModel, subCmd] = SidebarScreen.init()
      return [
        { _tag: 'SidebarScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'SidebarScreenMsg', subMsg })),
      ]
    }

    case 'PagePagination': {
      const [subModel, subCmd] = PaginationScreen.init()
      return [
        { _tag: 'PaginationScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'PaginationScreenMsg', subMsg })),
      ]
    }

    case 'PagePanel': {
      const [subModel, subCmd] = PanelScreen.init()
      return [
        { _tag: 'PanelScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'PanelScreenMsg', subMsg })),
      ]
    }

    case 'PagePopover': {
      const [subModel, subCmd] = PopoverScreen.init()
      return [
        { _tag: 'PopoverScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'PopoverScreenMsg', subMsg })),
      ]
    }

    case 'PageTabs': {
      const [subModel, subCmd] = TabsScreen.init()
      return [
        { _tag: 'TabsScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TabsScreenMsg', subMsg })),
      ]
    }

    case 'PageField': {
      const [subModel, subCmd] = FieldScreen.init()
      return [
        { _tag: 'FieldScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FieldScreenMsg', subMsg })),
      ]
    }

    case 'PageInput': {
      const [subModel, subCmd] = InputScreen.init()
      return [
        { _tag: 'InputScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'InputScreenMsg', subMsg })),
      ]
    }

    case 'PageTextarea': {
      const [subModel, subCmd] = TextareaScreen.init()
      return [
        { _tag: 'TextareaScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TextareaScreenMsg', subMsg })),
      ]
    }

    case 'PageSelect': {
      const [subModel, subCmd] = SelectScreen.init()
      return [
        { _tag: 'SelectScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'SelectScreenMsg', subMsg })),
      ]
    }

    case 'PageCheckbox': {
      const [subModel, subCmd] = CheckboxScreen.init()
      return [
        { _tag: 'CheckboxScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'CheckboxScreenMsg', subMsg })),
      ]
    }

    case 'PageRadio': {
      const [subModel, subCmd] = RadioScreen.init()
      return [
        { _tag: 'RadioScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'RadioScreenMsg', subMsg })),
      ]
    }

    case 'PageFile': {
      const [subModel, subCmd] = FileScreen.init()
      return [
        { _tag: 'FileScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FileScreenMsg', subMsg })),
      ]
    }

    case 'PageContainer': {
      const [subModel, subCmd] = ContainerScreen.init()
      return [
        { _tag: 'ContainerScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ContainerScreenMsg', subMsg })),
      ]
    }

    case 'PageHero': {
      const [subModel, subCmd] = HeroScreen.init()
      return [
        { _tag: 'HeroScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'HeroScreenMsg', subMsg })),
      ]
    }

    case 'PageSection': {
      const [subModel, subCmd] = SectionScreen.init()
      return [
        { _tag: 'SectionScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'SectionScreenMsg', subMsg })),
      ]
    }

    case 'PageLevel': {
      const [subModel, subCmd] = LevelScreen.init()
      return [
        { _tag: 'LevelScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'LevelScreenMsg', subMsg })),
      ]
    }

    case 'PageMediaObject': {
      const [subModel, subCmd] = MediaObjectScreen.init()
      return [
        { _tag: 'MediaObjectScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'MediaObjectScreenMsg', subMsg })),
      ]
    }

    case 'PageFooter': {
      const [subModel, subCmd] = FooterScreen.init()
      return [
        { _tag: 'FooterScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FooterScreenMsg', subMsg })),
      ]
    }

    case 'PageColumns': {
      const [subModel, subCmd] = ColumnsScreen.init()
      return [
        { _tag: 'ColumnsScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ColumnsScreenMsg', subMsg })),
      ]
    }

    case 'PageDotLoading': {
      const [subModel, subCmd] = DotLoadingScreen.init()
      return [
        { _tag: 'DotLoadingScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'DotLoadingScreenMsg', subMsg })),
      ]
    }

    case 'PageNotFound': {
      const [notFoundModel, notFoundCmd] = NotFoundScreen.init()
      return [
        { _tag: 'NotFoundScreenModel', model: notFoundModel },
        notFoundCmd.map((subMsg) => ({ _tag: 'NotFoundScreenMsg', subMsg })),
      ]
    }
  }
}

export const routerConfig = mkRouterConfig<ScreenModel, Msg>(
  initScreenModel,
  teaRouterMsg,
)

export const routerMsgHandler = (
  subMsg: Extract<Msg, { _tag: 'TeaRouterMsg' }>['subMsg'],
  model: Model,
): [Model, Cmd<Msg>] => {
  const [routerModel, routerCmd] = TeaRouter.update(routerConfig, undefined)(
    subMsg,
    model.router,
  )

  return [
    {
      ...model,
      router: routerModel,
    },
    routerCmd,
  ]
}

// Nav items route to their own href, the same URL a plain link click would open
const navItemRouteHandler =
  (item: NavItemData) =>
  (model: Model): [Model, Cmd<Msg>] =>
    pipe(
      O.fromNullable(item.href),
      O.fold(
        (): [Model, Cmd<Msg>] => [model, Cmd.none()],
        (href) =>
          routerMsgHandler(
            { _tag: 'ChangeRoute', route: parsePath(href) },
            model,
          ),
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
      const [routerModel, routerCmd] = navItemRouteHandler(msg.item)(
        updatedModel,
      )
      return [routerModel, Cmd.batch([subCmd, routerCmd])]
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
      const [routerModel, routerCmd] = navItemRouteHandler(msg.item)(
        updatedModel,
      )
      return [routerModel, Cmd.batch([subCmd, routerCmd])]
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
        return navItemRouteHandler(msg.item)(updatedModel)
      }
    } else {
      return [
        updatedModel,
        navbarCmd.map((subMsg) => ({ _tag: 'TopNavbarMsg' as const, subMsg })),
      ]
    }
  }

export const init = (location: Location): [Model, Cmd<Msg>] => {
  const [routerModel, routerCmd] = TeaRouter.init(
    routerConfig,
    location,
    undefined,
  )
  const [sidebarModel, sidebarCmd] = DsSidebar.init(false)
  const [rightSidebarModel, rightSidebarCmd] = DsSidebar.init(false)
  const [topNavbarModel, topNavbarCmd] = DsNavbar.init()
  const colorScheme = loadColorScheme()

  const model: Model = {
    router: routerModel,
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
      routerCmd,
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

    case 'TeaRouterMsg':
      return routerMsgHandler(msg.subMsg, model)

    case 'UpdateSearch':
      return [{ ...model, searchQuery: msg.query }, Cmd.none()]

    case 'HomeScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'HomeScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [homeModel, cmd] = HomeScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'HomeScreenModel',
              model: homeModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'HomeScreenMsg', subMsg })),
        ]
      }
    }

    case 'BlockScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'BlockScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = BlockScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'BlockScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'BlockScreenMsg', subMsg })),
        ]
      }
    }

    case 'BoxScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'BoxScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = BoxScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'BoxScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'BoxScreenMsg', subMsg })),
        ]
      }
    }

    case 'ButtonScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ButtonScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ButtonScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'ButtonScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'ButtonScreenMsg', subMsg })),
        ]
      }
    }

    case 'ContentScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ContentScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ContentScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'ContentScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'ContentScreenMsg', subMsg })),
        ]
      }
    }

    case 'DeleteScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'DeleteScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = DeleteScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'DeleteScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'DeleteScreenMsg', subMsg })),
        ]
      }
    }

    case 'IconScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'IconScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = IconScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'IconScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'IconScreenMsg', subMsg })),
        ]
      }
    }

    case 'ImageScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ImageScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ImageScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'ImageScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'ImageScreenMsg', subMsg })),
        ]
      }
    }

    case 'NotificationScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'NotificationScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = NotificationScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'NotificationScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'NotificationScreenMsg', subMsg })),
        ]
      }
    }

    case 'ProgressScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ProgressScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ProgressScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'ProgressScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'ProgressScreenMsg', subMsg })),
        ]
      }
    }

    case 'TableScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TableScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = TableScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'TableScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'TableScreenMsg', subMsg })),
        ]
      }
    }

    case 'TagScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TagScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = TagScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'TagScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'TagScreenMsg', subMsg })),
        ]
      }
    }

    case 'TitleScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TitleScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = TitleScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'TitleScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'TitleScreenMsg', subMsg })),
        ]
      }
    }

    case 'BreadcrumbScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'BreadcrumbScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = BreadcrumbScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'BreadcrumbScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'BreadcrumbScreenMsg', subMsg })),
        ]
      }
    }

    case 'CardScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'CardScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = CardScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'CardScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'CardScreenMsg', subMsg })),
        ]
      }
    }

    case 'DropdownScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'DropdownScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = DropdownScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'DropdownScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'DropdownScreenMsg', subMsg })),
        ]
      }
    }

    case 'MenuScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'MenuScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = MenuScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'MenuScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'MenuScreenMsg', subMsg })),
        ]
      }
    }

    case 'MessageScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'MessageScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = MessageScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'MessageScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'MessageScreenMsg', subMsg })),
        ]
      }
    }

    case 'ModalScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ModalScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ModalScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'ModalScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'ModalScreenMsg', subMsg })),
        ]
      }
    }

    case 'NavbarScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'NavbarScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = NavbarScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'NavbarScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'NavbarScreenMsg', subMsg })),
        ]
      }
    }

    case 'FloatingSidebarScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'FloatingSidebarScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = FloatingSidebarScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'FloatingSidebarScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'FloatingSidebarScreenMsg', subMsg })),
        ]
      }
    }

    case 'SidebarScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'SidebarScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = SidebarScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'SidebarScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'SidebarScreenMsg', subMsg })),
        ]
      }
    }

    case 'PaginationScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'PaginationScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = PaginationScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'PaginationScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'PaginationScreenMsg', subMsg })),
        ]
      }
    }

    case 'PanelScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'PanelScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = PanelScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'PanelScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'PanelScreenMsg', subMsg })),
        ]
      }
    }

    case 'PopoverScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'PopoverScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = PopoverScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'PopoverScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'PopoverScreenMsg', subMsg })),
        ]
      }
    }

    case 'TabsScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TabsScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = TabsScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'TabsScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'TabsScreenMsg', subMsg })),
        ]
      }
    }

    case 'FieldScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'FieldScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = FieldScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'FieldScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'FieldScreenMsg', subMsg })),
        ]
      }
    }

    case 'InputScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'InputScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = InputScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'InputScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'InputScreenMsg', subMsg })),
        ]
      }
    }

    case 'TextareaScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TextareaScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = TextareaScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'TextareaScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'TextareaScreenMsg', subMsg })),
        ]
      }
    }

    case 'SelectScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'SelectScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = SelectScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'SelectScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'SelectScreenMsg', subMsg })),
        ]
      }
    }

    case 'CheckboxScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'CheckboxScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = CheckboxScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'CheckboxScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'CheckboxScreenMsg', subMsg })),
        ]
      }
    }

    case 'RadioScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'RadioScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = RadioScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'RadioScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'RadioScreenMsg', subMsg })),
        ]
      }
    }

    case 'FileScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'FileScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = FileScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'FileScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'FileScreenMsg', subMsg })),
        ]
      }
    }

    case 'ContainerScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ContainerScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ContainerScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'ContainerScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'ContainerScreenMsg', subMsg })),
        ]
      }
    }

    case 'HeroScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'HeroScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = HeroScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'HeroScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'HeroScreenMsg', subMsg })),
        ]
      }
    }

    case 'SectionScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'SectionScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = SectionScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'SectionScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'SectionScreenMsg', subMsg })),
        ]
      }
    }

    case 'LevelScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'LevelScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = LevelScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'LevelScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'LevelScreenMsg', subMsg })),
        ]
      }
    }

    case 'MediaObjectScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'MediaObjectScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = MediaObjectScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'MediaObjectScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'MediaObjectScreenMsg', subMsg })),
        ]
      }
    }

    case 'FooterScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'FooterScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = FooterScreen.update(msg.subMsg, pageModel.model)
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'FooterScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'FooterScreenMsg', subMsg })),
        ]
      }
    }

    case 'ColumnsScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ColumnsScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ColumnsScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'ColumnsScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'ColumnsScreenMsg', subMsg })),
        ]
      }
    }

    case 'DotLoadingScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'DotLoadingScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = DotLoadingScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'DotLoadingScreenModel',
              model: subModel,
            }),
          },
          cmd.map((subMsg) => ({ _tag: 'DotLoadingScreenMsg', subMsg })),
        ]
      }
    }

    case 'NotFoundScreenMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'NotFoundScreenModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = NotFoundScreen.update(
          msg.subMsg,
          pageModel.model,
        )
        return [
          {
            ...model,
            router: TeaRouter.setPageModel(model.router, {
              _tag: 'NotFoundScreenModel',
              model: subModel,
            }),
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
