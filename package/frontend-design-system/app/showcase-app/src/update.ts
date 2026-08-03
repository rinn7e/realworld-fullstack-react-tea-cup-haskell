import { Menu as DsMenu } from '@rinn7e/realworld-design-system'
import { newUrl } from 'react-tea-cup'
import { Cmd, Task } from 'tea-cup-fp'

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
import * as SidebarPage from './page/sidebar/update'
import * as NotFoundPage from './page/not-found/update'
import * as NotificationPage from './page/notification/update'
import * as PaginationPage from './page/pagination/update'
import * as PanelPage from './page/panel/update'
import * as ProgressPage from './page/progress/update'
import * as RadioPage from './page/radio/update'
import * as SectionPage from './page/section/update'
import * as SelectPage from './page/select/update'
import * as TablePage from './page/table/update'
import * as TabsPage from './page/tabs/update'
import * as TagPage from './page/tag/update'
import * as TextareaPage from './page/textarea/update'
import * as TitlePage from './page/title/update'
import { parseAppRoute, toUrlString } from './route/parser'
import { type AppRoute, AppRouteEq } from './route/type'
import type { Model, Msg } from './type'

const pageTagToComponentId = (pageTag: string): string => {
  const match = pageTag.replace(/Page$/, '')
  return match === 'DotLoading'
    ? 'dot-loading'
    : match === 'MediaObject'
      ? 'media-object'
      : match.toLowerCase()
}

export const initPageModel =
  (newRoute: AppRoute) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const activeMenuId = pageTagToComponentId(newRoute.page._tag)
    const [menuModel] = DsMenu.init(activeMenuId)

    switch (newRoute.page._tag) {
      case 'HomePage': {
        const [homeModel, homeCmd] = HomePage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'HomePageModel', model: homeModel },
          },
          homeCmd.map((subMsg) => ({ _tag: 'HomePageMsg', subMsg })),
        ]
      }

      case 'BlockPage': {
        const [subModel, subCmd] = BlockPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'BlockPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'BlockPageMsg', subMsg })),
        ]
      }

      case 'BoxPage': {
        const [subModel, subCmd] = BoxPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'BoxPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'BoxPageMsg', subMsg })),
        ]
      }

      case 'ButtonPage': {
        const [subModel, subCmd] = ButtonPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'ButtonPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'ButtonPageMsg', subMsg })),
        ]
      }

      case 'ContentPage': {
        const [subModel, subCmd] = ContentPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'ContentPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'ContentPageMsg', subMsg })),
        ]
      }

      case 'DeletePage': {
        const [subModel, subCmd] = DeletePage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'DeletePageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'DeletePageMsg', subMsg })),
        ]
      }

      case 'IconPage': {
        const [subModel, subCmd] = IconPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'IconPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'IconPageMsg', subMsg })),
        ]
      }

      case 'ImagePage': {
        const [subModel, subCmd] = ImagePage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'ImagePageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'ImagePageMsg', subMsg })),
        ]
      }

      case 'NotificationPage': {
        const [subModel, subCmd] = NotificationPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'NotificationPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'NotificationPageMsg', subMsg })),
        ]
      }

      case 'ProgressPage': {
        const [subModel, subCmd] = ProgressPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'ProgressPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'ProgressPageMsg', subMsg })),
        ]
      }

      case 'TablePage': {
        const [subModel, subCmd] = TablePage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'TablePageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'TablePageMsg', subMsg })),
        ]
      }

      case 'TagPage': {
        const [subModel, subCmd] = TagPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'TagPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'TagPageMsg', subMsg })),
        ]
      }

      case 'TitlePage': {
        const [subModel, subCmd] = TitlePage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'TitlePageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'TitlePageMsg', subMsg })),
        ]
      }

      case 'BreadcrumbPage': {
        const [subModel, subCmd] = BreadcrumbPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'BreadcrumbPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'BreadcrumbPageMsg', subMsg })),
        ]
      }

      case 'CardPage': {
        const [subModel, subCmd] = CardPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'CardPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'CardPageMsg', subMsg })),
        ]
      }

      case 'DropdownPage': {
        const [subModel, subCmd] = DropdownPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'DropdownPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'DropdownPageMsg', subMsg })),
        ]
      }

      case 'MenuPage': {
        const [subModel, subCmd] = MenuPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'MenuPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'MenuPageMsg', subMsg })),
        ]
      }

      case 'MessagePage': {
        const [subModel, subCmd] = MessagePage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'MessagePageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'MessagePageMsg', subMsg })),
        ]
      }

      case 'ModalPage': {
        const [subModel, subCmd] = ModalPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'ModalPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'ModalPageMsg', subMsg })),
        ]
      }

      case 'NavbarPage': {
        const [subModel, subCmd] = NavbarPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'NavbarPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'NavbarPageMsg', subMsg })),
        ]
      }

      case 'SidebarPage': {
        const [subModel, subCmd] = SidebarPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'SidebarPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'SidebarPageMsg', subMsg })),
        ]
      }

      case 'PaginationPage': {
        const [subModel, subCmd] = PaginationPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'PaginationPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'PaginationPageMsg', subMsg })),
        ]
      }

      case 'PanelPage': {
        const [subModel, subCmd] = PanelPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'PanelPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'PanelPageMsg', subMsg })),
        ]
      }

      case 'TabsPage': {
        const [subModel, subCmd] = TabsPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'TabsPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'TabsPageMsg', subMsg })),
        ]
      }

      case 'FieldPage': {
        const [subModel, subCmd] = FieldPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'FieldPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'FieldPageMsg', subMsg })),
        ]
      }

      case 'InputPage': {
        const [subModel, subCmd] = InputPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'InputPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'InputPageMsg', subMsg })),
        ]
      }

      case 'TextareaPage': {
        const [subModel, subCmd] = TextareaPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'TextareaPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'TextareaPageMsg', subMsg })),
        ]
      }

      case 'SelectPage': {
        const [subModel, subCmd] = SelectPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'SelectPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'SelectPageMsg', subMsg })),
        ]
      }

      case 'CheckboxPage': {
        const [subModel, subCmd] = CheckboxPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'CheckboxPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'CheckboxPageMsg', subMsg })),
        ]
      }

      case 'RadioPage': {
        const [subModel, subCmd] = RadioPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'RadioPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'RadioPageMsg', subMsg })),
        ]
      }

      case 'FilePage': {
        const [subModel, subCmd] = FilePage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'FilePageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'FilePageMsg', subMsg })),
        ]
      }

      case 'ContainerPage': {
        const [subModel, subCmd] = ContainerPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'ContainerPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'ContainerPageMsg', subMsg })),
        ]
      }

      case 'HeroPage': {
        const [subModel, subCmd] = HeroPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'HeroPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'HeroPageMsg', subMsg })),
        ]
      }

      case 'SectionPage': {
        const [subModel, subCmd] = SectionPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'SectionPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'SectionPageMsg', subMsg })),
        ]
      }

      case 'LevelPage': {
        const [subModel, subCmd] = LevelPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'LevelPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'LevelPageMsg', subMsg })),
        ]
      }

      case 'MediaObjectPage': {
        const [subModel, subCmd] = MediaObjectPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'MediaObjectPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'MediaObjectPageMsg', subMsg })),
        ]
      }

      case 'FooterPage': {
        const [subModel, subCmd] = FooterPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'FooterPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'FooterPageMsg', subMsg })),
        ]
      }

      case 'ColumnsPage': {
        const [subModel, subCmd] = ColumnsPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'ColumnsPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'ColumnsPageMsg', subMsg })),
        ]
      }

      case 'DotLoadingPage': {
        const [subModel, subCmd] = DotLoadingPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'DotLoadingPageModel', model: subModel },
          },
          subCmd.map((subMsg) => ({ _tag: 'DotLoadingPageMsg', subMsg })),
        ]
      }

      case 'NotFoundPage':
      default: {
        const [notFoundModel, notFoundCmd] = NotFoundPage.init()
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'NotFoundPageModel', model: notFoundModel },
          },
          notFoundCmd.map((subMsg) => ({ _tag: 'NotFoundPageMsg', subMsg })),
        ]
      }
    }
  }

const navigate =
  (newRoute: AppRoute, isInternal: boolean) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const [updatedModel, updatedCmd] = initPageModel(newRoute)(model)

    const urlCmd = isInternal
      ? Task.perform(newUrl(toUrlString(newRoute)), (): Msg => ({
          _tag: 'NoOp',
        }))
      : Cmd.none<Msg>()

    return [
      {
        ...updatedModel,
        isInternal,
      },
      Cmd.batch([urlCmd, updatedCmd]),
    ]
  }

const execChangeRoute =
  (newRoute: AppRoute, isInternal: boolean) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (!AppRouteEq.equals(model.route, newRoute)) {
      return navigate(newRoute, isInternal)(model)
    } else {
      if (isInternal) {
        return navigate(newRoute, isInternal)(model)
      } else {
        return [model, Cmd.none()]
      }
    }
  }

const changeRouteHandler =
  (newRoute: AppRoute, isInternal: boolean) =>
  (model: Model): [Model, Cmd<Msg>] => {
    return execChangeRoute(newRoute, isInternal)(model)
  }

export const init = (location: Location): [Model, Cmd<Msg>] => {
  const route = parseAppRoute('', location.href)
  const [menuModel] = DsMenu.init('')

  const baseModel: Model = {
    route,
    isInternal: false,
    pageModel: { _tag: 'NotFoundPageModel', model: {} },
    searchQuery: '',
    menuModel,
  }

  return navigate(route, true)(baseModel)
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'NoOp':
      return [model, Cmd.none()]

    case 'Init':
      return init(msg.location)

    case 'UrlChange': {
      if (model.isInternal) {
        return [{ ...model, isInternal: false }, Cmd.none()]
      } else {
        const route = parseAppRoute('', msg.location.href)
        return changeRouteHandler(route, false)(model)
      }
    }

    case 'ChangeRoute': {
      return changeRouteHandler(msg.route, true)(model)
    }

    case 'UpdateSearch':
      return [{ ...model, searchQuery: msg.query }, Cmd.none()]

    case 'HomePageMsg': {
      if (model.pageModel._tag !== 'HomePageModel') return [model, Cmd.none()]
      const [homeModel, cmd] = HomePage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        {
          ...model,
          pageModel: { _tag: 'HomePageModel', model: homeModel },
        },
        cmd.map((subMsg) => ({ _tag: 'HomePageMsg', subMsg })),
      ]
    }

    case 'BlockPageMsg': {
      if (model.pageModel._tag !== 'BlockPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = BlockPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'BlockPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'BlockPageMsg', subMsg })),
      ]
    }
    case 'BoxPageMsg': {
      if (model.pageModel._tag !== 'BoxPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = BoxPage.update(msg.subMsg, model.pageModel.model)
      return [
        { ...model, pageModel: { _tag: 'BoxPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'BoxPageMsg', subMsg })),
      ]
    }
    case 'ButtonPageMsg': {
      if (model.pageModel._tag !== 'ButtonPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = ButtonPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'ButtonPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'ButtonPageMsg', subMsg })),
      ]
    }
    case 'ContentPageMsg': {
      if (model.pageModel._tag !== 'ContentPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = ContentPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'ContentPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'ContentPageMsg', subMsg })),
      ]
    }
    case 'DeletePageMsg': {
      if (model.pageModel._tag !== 'DeletePageModel') return [model, Cmd.none()]
      const [subModel, cmd] = DeletePage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'DeletePageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'DeletePageMsg', subMsg })),
      ]
    }
    case 'IconPageMsg': {
      if (model.pageModel._tag !== 'IconPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = IconPage.update(msg.subMsg, model.pageModel.model)
      return [
        { ...model, pageModel: { _tag: 'IconPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'IconPageMsg', subMsg })),
      ]
    }
    case 'ImagePageMsg': {
      if (model.pageModel._tag !== 'ImagePageModel') return [model, Cmd.none()]
      const [subModel, cmd] = ImagePage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'ImagePageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'ImagePageMsg', subMsg })),
      ]
    }
    case 'NotificationPageMsg': {
      if (model.pageModel._tag !== 'NotificationPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = NotificationPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        {
          ...model,
          pageModel: { _tag: 'NotificationPageModel', model: subModel },
        },
        cmd.map((subMsg) => ({ _tag: 'NotificationPageMsg', subMsg })),
      ]
    }
    case 'ProgressPageMsg': {
      if (model.pageModel._tag !== 'ProgressPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = ProgressPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'ProgressPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'ProgressPageMsg', subMsg })),
      ]
    }
    case 'TablePageMsg': {
      if (model.pageModel._tag !== 'TablePageModel') return [model, Cmd.none()]
      const [subModel, cmd] = TablePage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'TablePageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'TablePageMsg', subMsg })),
      ]
    }
    case 'TagPageMsg': {
      if (model.pageModel._tag !== 'TagPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = TagPage.update(msg.subMsg, model.pageModel.model)
      return [
        { ...model, pageModel: { _tag: 'TagPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'TagPageMsg', subMsg })),
      ]
    }
    case 'TitlePageMsg': {
      if (model.pageModel._tag !== 'TitlePageModel') return [model, Cmd.none()]
      const [subModel, cmd] = TitlePage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'TitlePageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'TitlePageMsg', subMsg })),
      ]
    }
    case 'BreadcrumbPageMsg': {
      if (model.pageModel._tag !== 'BreadcrumbPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = BreadcrumbPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        {
          ...model,
          pageModel: { _tag: 'BreadcrumbPageModel', model: subModel },
        },
        cmd.map((subMsg) => ({ _tag: 'BreadcrumbPageMsg', subMsg })),
      ]
    }
    case 'CardPageMsg': {
      if (model.pageModel._tag !== 'CardPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = CardPage.update(msg.subMsg, model.pageModel.model)
      return [
        { ...model, pageModel: { _tag: 'CardPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'CardPageMsg', subMsg })),
      ]
    }
    case 'DropdownPageMsg': {
      if (model.pageModel._tag !== 'DropdownPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = DropdownPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'DropdownPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'DropdownPageMsg', subMsg })),
      ]
    }
    case 'MenuPageMsg': {
      if (model.pageModel._tag !== 'MenuPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = MenuPage.update(msg.subMsg, model.pageModel.model)
      return [
        { ...model, pageModel: { _tag: 'MenuPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'MenuPageMsg', subMsg })),
      ]
    }
    case 'MessagePageMsg': {
      if (model.pageModel._tag !== 'MessagePageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = MessagePage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'MessagePageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'MessagePageMsg', subMsg })),
      ]
    }
    case 'ModalPageMsg': {
      if (model.pageModel._tag !== 'ModalPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = ModalPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'ModalPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'ModalPageMsg', subMsg })),
      ]
    }
    case 'NavbarPageMsg': {
      if (model.pageModel._tag !== 'NavbarPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = NavbarPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'NavbarPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'NavbarPageMsg', subMsg })),
      ]
    }
    case 'SidebarPageMsg': {
      if (model.pageModel._tag !== 'SidebarPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = SidebarPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'SidebarPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'SidebarPageMsg', subMsg })),
      ]
    }
    case 'PaginationPageMsg': {
      if (model.pageModel._tag !== 'PaginationPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = PaginationPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        {
          ...model,
          pageModel: { _tag: 'PaginationPageModel', model: subModel },
        },
        cmd.map((subMsg) => ({ _tag: 'PaginationPageMsg', subMsg })),
      ]
    }
    case 'PanelPageMsg': {
      if (model.pageModel._tag !== 'PanelPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = PanelPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'PanelPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'PanelPageMsg', subMsg })),
      ]
    }
    case 'TabsPageMsg': {
      if (model.pageModel._tag !== 'TabsPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = TabsPage.update(msg.subMsg, model.pageModel.model)
      return [
        { ...model, pageModel: { _tag: 'TabsPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'TabsPageMsg', subMsg })),
      ]
    }
    case 'FieldPageMsg': {
      if (model.pageModel._tag !== 'FieldPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = FieldPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'FieldPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'FieldPageMsg', subMsg })),
      ]
    }
    case 'InputPageMsg': {
      if (model.pageModel._tag !== 'InputPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = InputPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'InputPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'InputPageMsg', subMsg })),
      ]
    }
    case 'TextareaPageMsg': {
      if (model.pageModel._tag !== 'TextareaPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = TextareaPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'TextareaPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'TextareaPageMsg', subMsg })),
      ]
    }
    case 'SelectPageMsg': {
      if (model.pageModel._tag !== 'SelectPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = SelectPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'SelectPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'SelectPageMsg', subMsg })),
      ]
    }
    case 'CheckboxPageMsg': {
      if (model.pageModel._tag !== 'CheckboxPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = CheckboxPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'CheckboxPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'CheckboxPageMsg', subMsg })),
      ]
    }
    case 'RadioPageMsg': {
      if (model.pageModel._tag !== 'RadioPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = RadioPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'RadioPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'RadioPageMsg', subMsg })),
      ]
    }
    case 'FilePageMsg': {
      if (model.pageModel._tag !== 'FilePageModel') return [model, Cmd.none()]
      const [subModel, cmd] = FilePage.update(msg.subMsg, model.pageModel.model)
      return [
        { ...model, pageModel: { _tag: 'FilePageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'FilePageMsg', subMsg })),
      ]
    }
    case 'ContainerPageMsg': {
      if (model.pageModel._tag !== 'ContainerPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = ContainerPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        {
          ...model,
          pageModel: { _tag: 'ContainerPageModel', model: subModel },
        },
        cmd.map((subMsg) => ({ _tag: 'ContainerPageMsg', subMsg })),
      ]
    }
    case 'HeroPageMsg': {
      if (model.pageModel._tag !== 'HeroPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = HeroPage.update(msg.subMsg, model.pageModel.model)
      return [
        { ...model, pageModel: { _tag: 'HeroPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'HeroPageMsg', subMsg })),
      ]
    }
    case 'SectionPageMsg': {
      if (model.pageModel._tag !== 'SectionPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = SectionPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'SectionPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'SectionPageMsg', subMsg })),
      ]
    }
    case 'LevelPageMsg': {
      if (model.pageModel._tag !== 'LevelPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = LevelPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'LevelPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'LevelPageMsg', subMsg })),
      ]
    }
    case 'MediaObjectPageMsg': {
      if (model.pageModel._tag !== 'MediaObjectPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = MediaObjectPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        {
          ...model,
          pageModel: { _tag: 'MediaObjectPageModel', model: subModel },
        },
        cmd.map((subMsg) => ({ _tag: 'MediaObjectPageMsg', subMsg })),
      ]
    }
    case 'FooterPageMsg': {
      if (model.pageModel._tag !== 'FooterPageModel') return [model, Cmd.none()]
      const [subModel, cmd] = FooterPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'FooterPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'FooterPageMsg', subMsg })),
      ]
    }
    case 'ColumnsPageMsg': {
      if (model.pageModel._tag !== 'ColumnsPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = ColumnsPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        { ...model, pageModel: { _tag: 'ColumnsPageModel', model: subModel } },
        cmd.map((subMsg) => ({ _tag: 'ColumnsPageMsg', subMsg })),
      ]
    }
    case 'DotLoadingPageMsg': {
      if (model.pageModel._tag !== 'DotLoadingPageModel')
        return [model, Cmd.none()]
      const [subModel, cmd] = DotLoadingPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        {
          ...model,
          pageModel: { _tag: 'DotLoadingPageModel', model: subModel },
        },
        cmd.map((subMsg) => ({ _tag: 'DotLoadingPageMsg', subMsg })),
      ]
    }

    case 'NotFoundPageMsg': {
      if (model.pageModel._tag !== 'NotFoundPageModel')
        return [model, Cmd.none()]
      const [notFoundModel, cmd] = NotFoundPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        {
          ...model,
          pageModel: { _tag: 'NotFoundPageModel', model: notFoundModel },
        },
        cmd.map((subMsg) => ({ _tag: 'NotFoundPageMsg', subMsg })),
      ]
    }

    case 'MenuMsg': {
      const [menuModel, cmd] = DsMenu.update(msg.subMsg)(model.menuModel)
      if (msg.subMsg._tag === 'Select') {
        const item = msg.subMsg.id as string
        const pageTagName =
          item
            .split('-')
            .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
            .join('') + 'Page'
        const nextRoute: AppRoute = {
          page: { _tag: pageTagName } as unknown as AppRoute['page'],
        }
        return changeRouteHandler(nextRoute, true)({ ...model, menuModel })
      }
      return [
        { ...model, menuModel },
        cmd.map((subMsg: DsMenu.Msg) => ({ _tag: 'MenuMsg', subMsg })),
      ]
    }
  }
}
