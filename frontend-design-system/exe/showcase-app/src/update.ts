import { Menu, Navbar } from '@rinn7e/realworld-design-system'
import { newUrl } from 'react-tea-cup'
import { Cmd, Task } from 'tea-cup-fp'

import * as ButtonPage from './page/button/update'
import * as ComponentPage from './page/component/update'
import * as HomePage from './page/home/update'
import * as NotFoundPage from './page/not-found/update'
import { parseAppRoute, toUrlString } from './route/parser'
import { type AppRoute, AppRouteEq } from './route/type'
import type { Model, Msg } from './type'

export const initPageModel =
  (newRoute: AppRoute) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const activeMenuId =
      newRoute.page._tag === 'ComponentPage' ? newRoute.page.component : ''
    const [menuModel] = Menu.init(activeMenuId)

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

      case 'ComponentPage': {
        if (newRoute.page.component === 'button') {
          const [buttonModel, buttonCmd] = ButtonPage.init()
          return [
            {
              ...model,
              route: newRoute,
              menuModel,
              pageModel: { _tag: 'ButtonPageModel', model: buttonModel },
            },
            buttonCmd.map((subMsg) => ({ _tag: 'ButtonPageMsg', subMsg })),
          ]
        }

        const [componentModel, componentCmd] = ComponentPage.init(
          newRoute.page.component,
        )
        return [
          {
            ...model,
            route: newRoute,
            menuModel,
            pageModel: { _tag: 'ComponentPageModel', model: componentModel },
          },
          componentCmd.map((subMsg) => ({
            _tag: 'ComponentPageMsg',
            subMsg,
          })),
        ]
      }

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
      ? Task.perform(
          newUrl(toUrlString(newRoute)),
          (): Msg => ({ _tag: 'NoOp' }),
        )
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
  const [navbarModel] = Navbar.init()
  const [menuModel] = Menu.init('')

  const baseModel: Model = {
    route,
    isInternal: false,
    pageModel: { _tag: 'NotFoundPageModel', model: {} },
    searchQuery: '',
    navbarModel,
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

    case 'ButtonPageMsg': {
      if (model.pageModel._tag !== 'ButtonPageModel') return [model, Cmd.none()]
      const [buttonModel, cmd] = ButtonPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        {
          ...model,
          pageModel: { _tag: 'ButtonPageModel', model: buttonModel },
        },
        cmd.map((subMsg) => ({ _tag: 'ButtonPageMsg', subMsg })),
      ]
    }

    case 'ComponentPageMsg': {
      if (model.pageModel._tag !== 'ComponentPageModel')
        return [model, Cmd.none()]
      const [componentModel, cmd] = ComponentPage.update(
        msg.subMsg,
        model.pageModel.model,
      )
      return [
        {
          ...model,
          pageModel: { _tag: 'ComponentPageModel', model: componentModel },
        },
        cmd.map((subMsg) => ({ _tag: 'ComponentPageMsg', subMsg })),
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

    case 'NavbarMsg': {
      const [navbarModel, cmd] = Navbar.update(msg.subMsg)(model.navbarModel)
      return [
        { ...model, navbarModel },
        cmd.map((subMsg: Navbar.Msg) => ({ _tag: 'NavbarMsg', subMsg })),
      ]
    }

    case 'MenuMsg': {
      const [menuModel, cmd] = Menu.update(msg.subMsg)(model.menuModel)
      if (msg.subMsg._tag === 'Select') {
        const item = msg.subMsg.id as any
        const nextRoute: AppRoute = {
          page: { _tag: 'ComponentPage', component: item },
        }
        return changeRouteHandler(nextRoute, true)({ ...model, menuModel })
      }
      return [
        { ...model, menuModel },
        cmd.map((subMsg: Menu.Msg) => ({ _tag: 'MenuMsg', subMsg })),
      ]
    }
  }
}
