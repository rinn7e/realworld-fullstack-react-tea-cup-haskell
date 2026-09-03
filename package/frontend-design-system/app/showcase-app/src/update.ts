import * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import * as DsSidebar from '@rinn7e/realworld-design-system/component/sidebar'
import * as TeaRouter from '@rinn7e/tea-cup-router'
import { Cmd } from 'tea-cup-fp'

import * as BlockPage from './page/block/update'
import * as BoxPage from './page/box/update'
import * as BreadcrumbPage from './page/breadcrumb/update'
import * as ButtonPage from './page/button/update'
import * as CardPage from './page/card/update'
import * as CheckboxPage from './page/checkbox/update'
import * as ColumnsPage from './page/columns/update'
import * as ContainerPage from './page/container/update'
import * as ContentPage from './page/content/update'
import * as DeletePage from './page/delete/update'
import * as DotLoadingPage from './page/dot-loading/update'
import * as DropdownPage from './page/dropdown/update'
import * as FieldPage from './page/field/update'
import * as FilePage from './page/file/update'
import * as FloatingSidebarPage from './page/floating-sidebar/update'
import * as FooterPage from './page/footer/update'
import * as HeroPage from './page/hero/update'
import * as HomePage from './page/home/update'
import * as IconPage from './page/icon/update'
import * as ImagePage from './page/image/update'
import * as InputPage from './page/input/update'
import * as LevelPage from './page/level/update'
import * as MediaObjectPage from './page/media-object/update'
import * as MenuPage from './page/menu/update'
import * as MessagePage from './page/message/update'
import * as ModalPage from './page/modal/update'
import * as NavbarPage from './page/navbar/update'
import * as NotFoundPage from './page/not-found/update'
import * as NotificationPage from './page/notification/update'
import * as PaginationPage from './page/pagination/update'
import * as PanelPage from './page/panel/update'
import * as PopoverPage from './page/popover/update'
import * as ProgressPage from './page/progress/update'
import * as RadioPage from './page/radio/update'
import * as SectionPage from './page/section/update'
import * as SelectPage from './page/select/update'
import * as SidebarPage from './page/sidebar/update'
import * as TablePage from './page/table/update'
import * as TabsPage from './page/tabs/update'
import * as TagPage from './page/tag/update'
import * as TextareaPage from './page/textarea/update'
import * as TitlePage from './page/title/update'
import { parseAppRoute } from './route/parser'
import { mkRouterConfig } from './route/router'
import { type AppRoute } from './route/type'
import { type Model, type Msg, type PageModel, teaRouterMsg } from './type'
import { loadColorScheme, setColorSchemeCmd } from './util/theme-util'

export const initPageModel = (newRoute: AppRoute): [PageModel, Cmd<Msg>] => {
  switch (newRoute.page._tag) {
    case 'HomePage': {
      const [homeModel, homeCmd] = HomePage.init()
      return [
        { _tag: 'HomePageModel', model: homeModel },
        homeCmd.map((subMsg) => ({ _tag: 'HomePageMsg', subMsg })),
      ]
    }

    case 'BlockPage': {
      const [subModel, subCmd] = BlockPage.init()
      return [
        { _tag: 'BlockPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'BlockPageMsg', subMsg })),
      ]
    }

    case 'BoxPage': {
      const [subModel, subCmd] = BoxPage.init()
      return [
        { _tag: 'BoxPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'BoxPageMsg', subMsg })),
      ]
    }

    case 'ButtonPage': {
      const [subModel, subCmd] = ButtonPage.init()
      return [
        { _tag: 'ButtonPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ButtonPageMsg', subMsg })),
      ]
    }

    case 'ContentPage': {
      const [subModel, subCmd] = ContentPage.init()
      return [
        { _tag: 'ContentPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ContentPageMsg', subMsg })),
      ]
    }

    case 'DeletePage': {
      const [subModel, subCmd] = DeletePage.init()
      return [
        { _tag: 'DeletePageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'DeletePageMsg', subMsg })),
      ]
    }

    case 'IconPage': {
      const [subModel, subCmd] = IconPage.init()
      return [
        { _tag: 'IconPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'IconPageMsg', subMsg })),
      ]
    }

    case 'ImagePage': {
      const [subModel, subCmd] = ImagePage.init()
      return [
        { _tag: 'ImagePageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ImagePageMsg', subMsg })),
      ]
    }

    case 'NotificationPage': {
      const [subModel, subCmd] = NotificationPage.init()
      return [
        { _tag: 'NotificationPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'NotificationPageMsg', subMsg })),
      ]
    }

    case 'ProgressPage': {
      const [subModel, subCmd] = ProgressPage.init()
      return [
        { _tag: 'ProgressPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ProgressPageMsg', subMsg })),
      ]
    }

    case 'TablePage': {
      const [subModel, subCmd] = TablePage.init()
      return [
        { _tag: 'TablePageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TablePageMsg', subMsg })),
      ]
    }

    case 'TagPage': {
      const [subModel, subCmd] = TagPage.init()
      return [
        { _tag: 'TagPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TagPageMsg', subMsg })),
      ]
    }

    case 'TitlePage': {
      const [subModel, subCmd] = TitlePage.init()
      return [
        { _tag: 'TitlePageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TitlePageMsg', subMsg })),
      ]
    }

    case 'BreadcrumbPage': {
      const [subModel, subCmd] = BreadcrumbPage.init()
      return [
        { _tag: 'BreadcrumbPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'BreadcrumbPageMsg', subMsg })),
      ]
    }

    case 'CardPage': {
      const [subModel, subCmd] = CardPage.init()
      return [
        { _tag: 'CardPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'CardPageMsg', subMsg })),
      ]
    }

    case 'DropdownPage': {
      const [subModel, subCmd] = DropdownPage.init()
      return [
        { _tag: 'DropdownPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'DropdownPageMsg', subMsg })),
      ]
    }

    case 'MenuPage': {
      const [subModel, subCmd] = MenuPage.init()
      return [
        { _tag: 'MenuPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'MenuPageMsg', subMsg })),
      ]
    }

    case 'MessagePage': {
      const [subModel, subCmd] = MessagePage.init()
      return [
        { _tag: 'MessagePageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'MessagePageMsg', subMsg })),
      ]
    }

    case 'ModalPage': {
      const [subModel, subCmd] = ModalPage.init()
      return [
        { _tag: 'ModalPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ModalPageMsg', subMsg })),
      ]
    }

    case 'NavbarPage': {
      const [subModel, subCmd] = NavbarPage.init()
      return [
        { _tag: 'NavbarPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'NavbarPageMsg', subMsg })),
      ]
    }

    case 'FloatingSidebarPage': {
      const [subModel, subCmd] = FloatingSidebarPage.init()
      return [
        { _tag: 'FloatingSidebarPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FloatingSidebarPageMsg', subMsg })),
      ]
    }

    case 'SidebarPage': {
      const [subModel, subCmd] = SidebarPage.init()
      return [
        { _tag: 'SidebarPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'SidebarPageMsg', subMsg })),
      ]
    }

    case 'PaginationPage': {
      const [subModel, subCmd] = PaginationPage.init()
      return [
        { _tag: 'PaginationPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'PaginationPageMsg', subMsg })),
      ]
    }

    case 'PanelPage': {
      const [subModel, subCmd] = PanelPage.init()
      return [
        { _tag: 'PanelPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'PanelPageMsg', subMsg })),
      ]
    }

    case 'PopoverPage': {
      const [subModel, subCmd] = PopoverPage.init()
      return [
        { _tag: 'PopoverPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'PopoverPageMsg', subMsg })),
      ]
    }

    case 'TabsPage': {
      const [subModel, subCmd] = TabsPage.init()
      return [
        { _tag: 'TabsPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TabsPageMsg', subMsg })),
      ]
    }

    case 'FieldPage': {
      const [subModel, subCmd] = FieldPage.init()
      return [
        { _tag: 'FieldPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FieldPageMsg', subMsg })),
      ]
    }

    case 'InputPage': {
      const [subModel, subCmd] = InputPage.init()
      return [
        { _tag: 'InputPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'InputPageMsg', subMsg })),
      ]
    }

    case 'TextareaPage': {
      const [subModel, subCmd] = TextareaPage.init()
      return [
        { _tag: 'TextareaPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TextareaPageMsg', subMsg })),
      ]
    }

    case 'SelectPage': {
      const [subModel, subCmd] = SelectPage.init()
      return [
        { _tag: 'SelectPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'SelectPageMsg', subMsg })),
      ]
    }

    case 'CheckboxPage': {
      const [subModel, subCmd] = CheckboxPage.init()
      return [
        { _tag: 'CheckboxPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'CheckboxPageMsg', subMsg })),
      ]
    }

    case 'RadioPage': {
      const [subModel, subCmd] = RadioPage.init()
      return [
        { _tag: 'RadioPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'RadioPageMsg', subMsg })),
      ]
    }

    case 'FilePage': {
      const [subModel, subCmd] = FilePage.init()
      return [
        { _tag: 'FilePageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FilePageMsg', subMsg })),
      ]
    }

    case 'ContainerPage': {
      const [subModel, subCmd] = ContainerPage.init()
      return [
        { _tag: 'ContainerPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ContainerPageMsg', subMsg })),
      ]
    }

    case 'HeroPage': {
      const [subModel, subCmd] = HeroPage.init()
      return [
        { _tag: 'HeroPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'HeroPageMsg', subMsg })),
      ]
    }

    case 'SectionPage': {
      const [subModel, subCmd] = SectionPage.init()
      return [
        { _tag: 'SectionPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'SectionPageMsg', subMsg })),
      ]
    }

    case 'LevelPage': {
      const [subModel, subCmd] = LevelPage.init()
      return [
        { _tag: 'LevelPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'LevelPageMsg', subMsg })),
      ]
    }

    case 'MediaObjectPage': {
      const [subModel, subCmd] = MediaObjectPage.init()
      return [
        { _tag: 'MediaObjectPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'MediaObjectPageMsg', subMsg })),
      ]
    }

    case 'FooterPage': {
      const [subModel, subCmd] = FooterPage.init()
      return [
        { _tag: 'FooterPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FooterPageMsg', subMsg })),
      ]
    }

    case 'ColumnsPage': {
      const [subModel, subCmd] = ColumnsPage.init()
      return [
        { _tag: 'ColumnsPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ColumnsPageMsg', subMsg })),
      ]
    }

    case 'DotLoadingPage': {
      const [subModel, subCmd] = DotLoadingPage.init()
      return [
        { _tag: 'DotLoadingPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'DotLoadingPageMsg', subMsg })),
      ]
    }

    case 'NotFoundPage':
    default: {
      const [notFoundModel, notFoundCmd] = NotFoundPage.init()
      return [
        { _tag: 'NotFoundPageModel', model: notFoundModel },
        notFoundCmd.map((subMsg) => ({ _tag: 'NotFoundPageMsg', subMsg })),
      ]
    }
  }
}

export const routerConfig = mkRouterConfig<PageModel, Msg>(
  initPageModel,
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
      const compId = msg.item.key
      const nextRoute = parseAppRoute('', `/${compId}`)
      const [routerModel, routerCmd] = routerMsgHandler(
        { _tag: 'ChangeRoute', route: nextRoute },
        updatedModel,
      )
      return [routerModel, Cmd.batch([subCmd, routerCmd])]
    }
    return [updatedModel, subCmd]
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
      const compId = msg.item.key
      const nextRoute = parseAppRoute('', `/${compId}`)
      const [routerModel, routerCmd] = routerMsgHandler(
        { _tag: 'ChangeRoute', route: nextRoute },
        updatedModel,
      )
      return [routerModel, Cmd.batch([subCmd, routerCmd])]
    }
    return [updatedModel, subCmd]
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
      }
      if (msg.item.key === 'theme-dark') {
        return [
          { ...updatedModel, colorScheme: 'dark' },
          setColorSchemeCmd('dark'),
        ]
      }
      if (msg.item.key === 'theme-auto') {
        return [
          { ...updatedModel, colorScheme: 'auto' },
          setColorSchemeCmd('auto'),
        ]
      }
      const nextRoute = parseAppRoute('', `/${msg.item.key}`)
      return routerMsgHandler(
        { _tag: 'ChangeRoute', route: nextRoute },
        updatedModel,
      )
    }
    return [
      updatedModel,
      navbarCmd.map((subMsg) => ({ _tag: 'TopNavbarMsg' as const, subMsg })),
    ]
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

    case 'HomePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'HomePageModel') return [model, Cmd.none()]
      const [homeModel, cmd] = HomePage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'HomePageModel',
            model: homeModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'HomePageMsg', subMsg })),
      ]
    }

    case 'BlockPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'BlockPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = BlockPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'BlockPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'BlockPageMsg', subMsg })),
      ]
    }

    case 'BoxPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'BoxPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = BoxPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'BoxPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'BoxPageMsg', subMsg })),
      ]
    }

    case 'ButtonPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ButtonPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = ButtonPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'ButtonPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'ButtonPageMsg', subMsg })),
      ]
    }

    case 'ContentPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ContentPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = ContentPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'ContentPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'ContentPageMsg', subMsg })),
      ]
    }

    case 'DeletePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'DeletePageModel') return [model, Cmd.none()]
      const [subModel, cmd] = DeletePage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'DeletePageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'DeletePageMsg', subMsg })),
      ]
    }

    case 'IconPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'IconPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = IconPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'IconPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'IconPageMsg', subMsg })),
      ]
    }

    case 'ImagePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ImagePageModel') return [model, Cmd.none()]
      const [subModel, cmd] = ImagePage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'ImagePageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'ImagePageMsg', subMsg })),
      ]
    }

    case 'NotificationPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'NotificationPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = NotificationPage.update(
        msg.subMsg,
        pageModel.model,
      )
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'NotificationPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'NotificationPageMsg', subMsg })),
      ]
    }

    case 'ProgressPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ProgressPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = ProgressPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'ProgressPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'ProgressPageMsg', subMsg })),
      ]
    }

    case 'TablePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TablePageModel') return [model, Cmd.none()]
      const [subModel, cmd] = TablePage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'TablePageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'TablePageMsg', subMsg })),
      ]
    }

    case 'TagPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TagPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = TagPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'TagPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'TagPageMsg', subMsg })),
      ]
    }

    case 'TitlePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TitlePageModel') return [model, Cmd.none()]
      const [subModel, cmd] = TitlePage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'TitlePageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'TitlePageMsg', subMsg })),
      ]
    }

    case 'BreadcrumbPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'BreadcrumbPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = BreadcrumbPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'BreadcrumbPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'BreadcrumbPageMsg', subMsg })),
      ]
    }

    case 'CardPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'CardPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = CardPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'CardPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'CardPageMsg', subMsg })),
      ]
    }

    case 'DropdownPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'DropdownPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = DropdownPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'DropdownPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'DropdownPageMsg', subMsg })),
      ]
    }

    case 'MenuPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'MenuPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = MenuPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'MenuPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'MenuPageMsg', subMsg })),
      ]
    }

    case 'MessagePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'MessagePageModel') return [model, Cmd.none()]
      const [subModel, cmd] = MessagePage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'MessagePageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'MessagePageMsg', subMsg })),
      ]
    }

    case 'ModalPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ModalPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = ModalPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'ModalPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'ModalPageMsg', subMsg })),
      ]
    }

    case 'NavbarPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'NavbarPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = NavbarPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'NavbarPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'NavbarPageMsg', subMsg })),
      ]
    }

    case 'FloatingSidebarPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'FloatingSidebarPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = FloatingSidebarPage.update(
        msg.subMsg,
        pageModel.model,
      )
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'FloatingSidebarPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'FloatingSidebarPageMsg', subMsg })),
      ]
    }

    case 'SidebarPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'SidebarPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = SidebarPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'SidebarPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'SidebarPageMsg', subMsg })),
      ]
    }

    case 'PaginationPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'PaginationPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = PaginationPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'PaginationPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'PaginationPageMsg', subMsg })),
      ]
    }

    case 'PanelPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'PanelPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = PanelPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'PanelPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'PanelPageMsg', subMsg })),
      ]
    }

    case 'PopoverPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'PopoverPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = PopoverPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'PopoverPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'PopoverPageMsg', subMsg })),
      ]
    }

    case 'TabsPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TabsPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = TabsPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'TabsPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'TabsPageMsg', subMsg })),
      ]
    }

    case 'FieldPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'FieldPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = FieldPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'FieldPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'FieldPageMsg', subMsg })),
      ]
    }

    case 'InputPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'InputPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = InputPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'InputPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'InputPageMsg', subMsg })),
      ]
    }

    case 'TextareaPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TextareaPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = TextareaPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'TextareaPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'TextareaPageMsg', subMsg })),
      ]
    }

    case 'SelectPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'SelectPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = SelectPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'SelectPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'SelectPageMsg', subMsg })),
      ]
    }

    case 'CheckboxPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'CheckboxPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = CheckboxPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'CheckboxPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'CheckboxPageMsg', subMsg })),
      ]
    }

    case 'RadioPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'RadioPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = RadioPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'RadioPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'RadioPageMsg', subMsg })),
      ]
    }

    case 'FilePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'FilePageModel') return [model, Cmd.none()]
      const [subModel, cmd] = FilePage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'FilePageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'FilePageMsg', subMsg })),
      ]
    }

    case 'ContainerPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ContainerPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = ContainerPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'ContainerPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'ContainerPageMsg', subMsg })),
      ]
    }

    case 'HeroPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'HeroPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = HeroPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'HeroPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'HeroPageMsg', subMsg })),
      ]
    }

    case 'SectionPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'SectionPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = SectionPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'SectionPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'SectionPageMsg', subMsg })),
      ]
    }

    case 'LevelPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'LevelPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = LevelPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'LevelPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'LevelPageMsg', subMsg })),
      ]
    }

    case 'MediaObjectPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'MediaObjectPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = MediaObjectPage.update(
        msg.subMsg,
        pageModel.model,
      )
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'MediaObjectPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'MediaObjectPageMsg', subMsg })),
      ]
    }

    case 'FooterPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'FooterPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = FooterPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'FooterPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'FooterPageMsg', subMsg })),
      ]
    }

    case 'ColumnsPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ColumnsPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = ColumnsPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'ColumnsPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'ColumnsPageMsg', subMsg })),
      ]
    }

    case 'DotLoadingPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'DotLoadingPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = DotLoadingPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'DotLoadingPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'DotLoadingPageMsg', subMsg })),
      ]
    }

    case 'NotFoundPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'NotFoundPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = NotFoundPage.update(msg.subMsg, pageModel.model)
      return [
        {
          ...model,
          router: TeaRouter.setPageModel(model.router, {
            _tag: 'NotFoundPageModel',
            model: subModel,
          }),
        },
        cmd.map((subMsg) => ({ _tag: 'NotFoundPageMsg', subMsg })),
      ]
    }

    case 'SidebarMsg':
      return sidebarMsgHandler(msg.subMsg)(model)

    case 'RightSidebarMsg':
      return rightSidebarMsgHandler(msg.subMsg)(model)

    case 'TopNavbarMsg':
      return topNavbarMsgHandler(msg.subMsg)(model)
  }
}
