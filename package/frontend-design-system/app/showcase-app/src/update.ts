import * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import * as DsSidebar from '@rinn7e/realworld-design-system/component/sidebar'
import type { NavItemData } from '@rinn7e/realworld-design-system/type/nav-item'
import * as TeaRouter from '@rinn7e/tea-cup-router'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { type AppRoute, parsePath } from '@/common/type/route'
import * as BlockPage from '@/page/block-page'
import * as BoxPage from '@/page/box-page'
import * as BreadcrumbPage from '@/page/breadcrumb-page'
import * as ButtonPage from '@/page/button-page'
import * as CardPage from '@/page/card-page'
import * as CheckboxPage from '@/page/checkbox-page'
import * as ColumnsPage from '@/page/columns-page'
import * as ContainerPage from '@/page/container-page'
import * as ContentPage from '@/page/content-page'
import * as DeletePage from '@/page/delete-page'
import * as DotLoadingPage from '@/page/dot-loading-page'
import * as DropdownPage from '@/page/dropdown-page'
import * as FieldPage from '@/page/field-page'
import * as FilePage from '@/page/file-page'
import * as FloatingSidebarPage from '@/page/floating-sidebar-page'
import * as FooterPage from '@/page/footer-page'
import * as HeroPage from '@/page/hero-page'
import * as HomePage from '@/page/home-page'
import * as IconPage from '@/page/icon-page'
import * as ImagePage from '@/page/image-page'
import * as InputPage from '@/page/input-page'
import * as LevelPage from '@/page/level-page'
import * as MediaObjectPage from '@/page/media-object-page'
import * as MenuPage from '@/page/menu-page'
import * as MessagePage from '@/page/message-page'
import * as ModalPage from '@/page/modal-page'
import * as NavbarPage from '@/page/navbar-page'
import * as NotFoundPage from '@/page/not-found-page'
import * as NotificationPage from '@/page/notification-page'
import * as PaginationPage from '@/page/pagination-page'
import * as PanelPage from '@/page/panel-page'
import * as PopoverPage from '@/page/popover-page'
import * as ProgressPage from '@/page/progress-page'
import * as RadioPage from '@/page/radio-page'
import * as SectionPage from '@/page/section-page'
import * as SelectPage from '@/page/select-page'
import * as SidebarPage from '@/page/sidebar-page'
import * as TablePage from '@/page/table-page'
import * as TabsPage from '@/page/tabs-page'
import * as TagPage from '@/page/tag-page'
import * as TextareaPage from '@/page/textarea-page'
import * as TitlePage from '@/page/title-page'
import { loadColorScheme, setColorSchemeCmd } from '@/theme/util'

import { mkRouterConfig } from './router-config'
import { type Model, type Msg, type PageModel, teaRouterMsg } from './type'

export const initPageModel = (newRoute: AppRoute): [PageModel, Cmd<Msg>] => {
  switch (newRoute.page._tag) {
    case 'PageHome': {
      const [homeModel, homeCmd] = HomePage.init()
      return [
        { _tag: 'HomePageModel', model: homeModel },
        homeCmd.map((subMsg) => ({ _tag: 'HomePageMsg', subMsg })),
      ]
    }

    case 'PageBlock': {
      const [subModel, subCmd] = BlockPage.init()
      return [
        { _tag: 'BlockPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'BlockPageMsg', subMsg })),
      ]
    }

    case 'PageBox': {
      const [subModel, subCmd] = BoxPage.init()
      return [
        { _tag: 'BoxPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'BoxPageMsg', subMsg })),
      ]
    }

    case 'PageButton': {
      const [subModel, subCmd] = ButtonPage.init()
      return [
        { _tag: 'ButtonPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ButtonPageMsg', subMsg })),
      ]
    }

    case 'PageContent': {
      const [subModel, subCmd] = ContentPage.init()
      return [
        { _tag: 'ContentPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ContentPageMsg', subMsg })),
      ]
    }

    case 'PageDelete': {
      const [subModel, subCmd] = DeletePage.init()
      return [
        { _tag: 'DeletePageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'DeletePageMsg', subMsg })),
      ]
    }

    case 'PageIcon': {
      const [subModel, subCmd] = IconPage.init()
      return [
        { _tag: 'IconPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'IconPageMsg', subMsg })),
      ]
    }

    case 'PageImage': {
      const [subModel, subCmd] = ImagePage.init()
      return [
        { _tag: 'ImagePageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ImagePageMsg', subMsg })),
      ]
    }

    case 'PageNotification': {
      const [subModel, subCmd] = NotificationPage.init()
      return [
        { _tag: 'NotificationPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'NotificationPageMsg', subMsg })),
      ]
    }

    case 'PageProgress': {
      const [subModel, subCmd] = ProgressPage.init()
      return [
        { _tag: 'ProgressPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ProgressPageMsg', subMsg })),
      ]
    }

    case 'PageTable': {
      const [subModel, subCmd] = TablePage.init()
      return [
        { _tag: 'TablePageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TablePageMsg', subMsg })),
      ]
    }

    case 'PageTag': {
      const [subModel, subCmd] = TagPage.init()
      return [
        { _tag: 'TagPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TagPageMsg', subMsg })),
      ]
    }

    case 'PageTitle': {
      const [subModel, subCmd] = TitlePage.init()
      return [
        { _tag: 'TitlePageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TitlePageMsg', subMsg })),
      ]
    }

    case 'PageBreadcrumb': {
      const [subModel, subCmd] = BreadcrumbPage.init()
      return [
        { _tag: 'BreadcrumbPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'BreadcrumbPageMsg', subMsg })),
      ]
    }

    case 'PageCard': {
      const [subModel, subCmd] = CardPage.init()
      return [
        { _tag: 'CardPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'CardPageMsg', subMsg })),
      ]
    }

    case 'PageDropdown': {
      const [subModel, subCmd] = DropdownPage.init()
      return [
        { _tag: 'DropdownPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'DropdownPageMsg', subMsg })),
      ]
    }

    case 'PageMenu': {
      const [subModel, subCmd] = MenuPage.init()
      return [
        { _tag: 'MenuPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'MenuPageMsg', subMsg })),
      ]
    }

    case 'PageMessage': {
      const [subModel, subCmd] = MessagePage.init()
      return [
        { _tag: 'MessagePageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'MessagePageMsg', subMsg })),
      ]
    }

    case 'PageModal': {
      const [subModel, subCmd] = ModalPage.init()
      return [
        { _tag: 'ModalPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ModalPageMsg', subMsg })),
      ]
    }

    case 'PageNavbar': {
      const [subModel, subCmd] = NavbarPage.init()
      return [
        { _tag: 'NavbarPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'NavbarPageMsg', subMsg })),
      ]
    }

    case 'PageFloatingSidebar': {
      const [subModel, subCmd] = FloatingSidebarPage.init()
      return [
        { _tag: 'FloatingSidebarPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FloatingSidebarPageMsg', subMsg })),
      ]
    }

    case 'PageSidebar': {
      const [subModel, subCmd] = SidebarPage.init()
      return [
        { _tag: 'SidebarPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'SidebarPageMsg', subMsg })),
      ]
    }

    case 'PagePagination': {
      const [subModel, subCmd] = PaginationPage.init()
      return [
        { _tag: 'PaginationPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'PaginationPageMsg', subMsg })),
      ]
    }

    case 'PagePanel': {
      const [subModel, subCmd] = PanelPage.init()
      return [
        { _tag: 'PanelPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'PanelPageMsg', subMsg })),
      ]
    }

    case 'PagePopover': {
      const [subModel, subCmd] = PopoverPage.init()
      return [
        { _tag: 'PopoverPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'PopoverPageMsg', subMsg })),
      ]
    }

    case 'PageTabs': {
      const [subModel, subCmd] = TabsPage.init()
      return [
        { _tag: 'TabsPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TabsPageMsg', subMsg })),
      ]
    }

    case 'PageField': {
      const [subModel, subCmd] = FieldPage.init()
      return [
        { _tag: 'FieldPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FieldPageMsg', subMsg })),
      ]
    }

    case 'PageInput': {
      const [subModel, subCmd] = InputPage.init()
      return [
        { _tag: 'InputPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'InputPageMsg', subMsg })),
      ]
    }

    case 'PageTextarea': {
      const [subModel, subCmd] = TextareaPage.init()
      return [
        { _tag: 'TextareaPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TextareaPageMsg', subMsg })),
      ]
    }

    case 'PageSelect': {
      const [subModel, subCmd] = SelectPage.init()
      return [
        { _tag: 'SelectPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'SelectPageMsg', subMsg })),
      ]
    }

    case 'PageCheckbox': {
      const [subModel, subCmd] = CheckboxPage.init()
      return [
        { _tag: 'CheckboxPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'CheckboxPageMsg', subMsg })),
      ]
    }

    case 'PageRadio': {
      const [subModel, subCmd] = RadioPage.init()
      return [
        { _tag: 'RadioPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'RadioPageMsg', subMsg })),
      ]
    }

    case 'PageFile': {
      const [subModel, subCmd] = FilePage.init()
      return [
        { _tag: 'FilePageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FilePageMsg', subMsg })),
      ]
    }

    case 'PageContainer': {
      const [subModel, subCmd] = ContainerPage.init()
      return [
        { _tag: 'ContainerPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ContainerPageMsg', subMsg })),
      ]
    }

    case 'PageHero': {
      const [subModel, subCmd] = HeroPage.init()
      return [
        { _tag: 'HeroPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'HeroPageMsg', subMsg })),
      ]
    }

    case 'PageSection': {
      const [subModel, subCmd] = SectionPage.init()
      return [
        { _tag: 'SectionPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'SectionPageMsg', subMsg })),
      ]
    }

    case 'PageLevel': {
      const [subModel, subCmd] = LevelPage.init()
      return [
        { _tag: 'LevelPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'LevelPageMsg', subMsg })),
      ]
    }

    case 'PageMediaObject': {
      const [subModel, subCmd] = MediaObjectPage.init()
      return [
        { _tag: 'MediaObjectPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'MediaObjectPageMsg', subMsg })),
      ]
    }

    case 'PageFooter': {
      const [subModel, subCmd] = FooterPage.init()
      return [
        { _tag: 'FooterPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FooterPageMsg', subMsg })),
      ]
    }

    case 'PageColumns': {
      const [subModel, subCmd] = ColumnsPage.init()
      return [
        { _tag: 'ColumnsPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ColumnsPageMsg', subMsg })),
      ]
    }

    case 'PageDotLoading': {
      const [subModel, subCmd] = DotLoadingPage.init()
      return [
        { _tag: 'DotLoadingPageModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'DotLoadingPageMsg', subMsg })),
      ]
    }

    case 'PageNotFound': {
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

    case 'HomePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'HomePageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'BlockPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'BlockPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'BoxPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'BoxPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'ButtonPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ButtonPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'ContentPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ContentPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'DeletePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'DeletePageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'IconPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'IconPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'ImagePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ImagePageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'NotificationPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'NotificationPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'ProgressPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ProgressPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'TablePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TablePageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'TagPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TagPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'TitlePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TitlePageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'BreadcrumbPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'BreadcrumbPageModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = BreadcrumbPage.update(
          msg.subMsg,
          pageModel.model,
        )
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
    }

    case 'CardPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'CardPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'DropdownPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'DropdownPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'MenuPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'MenuPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'MessagePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'MessagePageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'ModalPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ModalPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'NavbarPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'NavbarPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'FloatingSidebarPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'FloatingSidebarPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'SidebarPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'SidebarPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'PaginationPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'PaginationPageModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = PaginationPage.update(
          msg.subMsg,
          pageModel.model,
        )
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
    }

    case 'PanelPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'PanelPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'PopoverPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'PopoverPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'TabsPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TabsPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'FieldPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'FieldPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'InputPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'InputPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'TextareaPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'TextareaPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'SelectPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'SelectPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'CheckboxPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'CheckboxPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'RadioPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'RadioPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'FilePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'FilePageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'ContainerPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ContainerPageModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = ContainerPage.update(
          msg.subMsg,
          pageModel.model,
        )
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
    }

    case 'HeroPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'HeroPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'SectionPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'SectionPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'LevelPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'LevelPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'MediaObjectPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'MediaObjectPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'FooterPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'FooterPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'ColumnsPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'ColumnsPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'DotLoadingPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'DotLoadingPageModel') {
        return [model, Cmd.none()]
      } else {
        const [subModel, cmd] = DotLoadingPage.update(
          msg.subMsg,
          pageModel.model,
        )
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
    }

    case 'NotFoundPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag !== 'NotFoundPageModel') {
        return [model, Cmd.none()]
      } else {
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
    }

    case 'SidebarMsg':
      return sidebarMsgHandler(msg.subMsg)(model)

    case 'RightSidebarMsg':
      return rightSidebarMsgHandler(msg.subMsg)(model)

    case 'TopNavbarMsg':
      return topNavbarMsgHandler(msg.subMsg)(model)
  }
}
