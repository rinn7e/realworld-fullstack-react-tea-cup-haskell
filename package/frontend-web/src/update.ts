import * as DsFloatingSidebar from '@rinn7e/realworld-design-system/component/floating-sidebar'
import * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import { msgCmd, taskFromTE, updateAndCmd } from '@rinn7e/tea-cup-prelude'
import * as TeaRouter from '@rinn7e/tea-cup-router'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd, Task } from 'tea-cup-fp'

import {
  type User,
  type UserWithToken,
  getCurrentUser,
  trackVisitor,
} from '@/common/api'
import { getToken, removeToken, saveToken } from '@/common/cache'
import { findNavItemRoute } from '@/common/nav-link-helper'
import { mkRouterConfig } from '@/common/router'
import {
  type AppRoute,
  AppRouteEq,
  type HomeTab,
  homePage,
  toUrlString,
} from '@/common/type/route'
import { type Shared } from '@/common/type/shared'
import * as DebugPanel from '@/component/debug-panel'
import * as ArticlePage from '@/page/article/update'
import * as EditorPage from '@/page/editor/update'
import * as HomePage from '@/page/home/update'
import * as LoginPage from '@/page/login/update'
import * as ProfilePage from '@/page/profile/update'
import * as SettingsPage from '@/page/settings/update'
import * as SignupPage from '@/page/signup/update'
import type { Model, Msg, PageModel } from '@/type'
import {
  type ColorScheme,
  loadColorScheme,
  setColorSchemeCmd,
} from '@/util/theme-util'

// Initialization
// ---------------------------------------------

export const preInit = (location: Location): [Model | null, Cmd<Msg>] => {
  return [null, initializeCmd(location)]
}

export const preUpdate = (
  msg: Msg,
  model: Model | null,
): [Model | null, Cmd<Msg>] => {
  if (model === null) {
    if (msg._tag === 'Init') {
      return init(msg.location, msg.user, msg.isUnavailable, msg.token)
    }
    return [null, Cmd.none()]
  }

  return update(msg, model)
}

// Init, Update
// ---------------------------------------------

export const init = (
  location: Location,
  user: O.Option<User>,
  isUnavailable: boolean,
  token: O.Option<string>,
): [Model, Cmd<Msg>] => {
  if (!isUnavailable && token._tag === 'None') {
    removeToken()
  }
  const initialColorScheme = loadColorScheme()
  const shared = { user, token }
  const [routerModel, routerCmd] = TeaRouter.init(
    routerConfig,
    location,
    shared,
  )

  const model: Model = {
    router: routerModel,
    unavailableMode: isUnavailable,
    shared,
    debugPanel: DebugPanel.init(),
    sidebar: DsFloatingSidebar.init()[0],
    navbar: DsNavbar.init()[0],
    colorScheme: initialColorScheme,
  }
  const initCmd = Cmd.batch([
    routerCmd,
    trackVisitorCmd(token, TeaRouter.getRoute(routerModel)),
    setColorSchemeCmd(initialColorScheme).map((): Msg => ({ _tag: 'NoOp' })),
  ])

  return [model, initCmd]
}

export const initializeCmd = (location: Location): Cmd<Msg> => {
  const storedToken = getToken()
  if (storedToken) {
    return Task.attempt(taskFromTE(getCurrentUser(storedToken)), (res): Msg => {
      // isUnavailable is true when the server is not responsive which results in not being able to validate if current token is valid or not.
      const isUnavailable =
        res.tag === 'Err' &&
        (res.err.statusCode === 500 ||
          res.err.statusCode === 0 ||
          // Err but 200 mean we have malformed json
          res.err.statusCode === 200)
      const token =
        res.tag === 'Ok'
          ? O.some(res.value.user.token)
          : // used stored token when isUnavailable
            isUnavailable
            ? O.some(storedToken)
            : O.none

      // Update local storage base on token value
      if (token._tag === 'Some') saveToken(token.value)
      else removeToken()

      return {
        _tag: 'Init',
        location,
        user: res.tag === 'Ok' ? O.some(res.value.user as User) : O.none,
        isUnavailable,
        token: token,
      }
    })
  }
  return msgCmd({
    _tag: 'Init',
    location,
    user: O.none,
    isUnavailable: false,
    token: O.none,
  })
}

// TODO this is used for both init and reInit
// if we want to do some reInit action,
// we can pass oldRoute as argument here
export const initPageModel = (
  newRoute: AppRoute,
  shared: Shared,
  _prev?: {
    readonly route: AppRoute
    readonly pageModel: PageModel
  },
): [PageModel, Cmd<Msg>] => {
  switch (newRoute.page._tag) {
    case 'HomePage': {
      const [homeModel, homeCmd] = HomePage.init(
        newRoute.page.tab,
        newRoute.page.page,
        shared,
      )
      return [
        { _tag: 'HomePageModel', model: homeModel },
        homeCmd.map((msg) => ({ _tag: 'HomePageMsg', subMsg: msg })),
      ]
    }
    case 'ArticlePage': {
      const [articleModel, articleCmd] = ArticlePage.init(
        newRoute.page.slug,
        shared,
      )
      return [
        { _tag: 'ArticlePageModel', model: articleModel },
        articleCmd.map((msg) => ({
          _tag: 'ArticlePageMsg',
          subMsg: msg,
        })),
      ]
    }
    case 'LoginPage': {
      const [loginModel, loginCmd] = LoginPage.init(shared)
      return [
        { _tag: 'LoginPageModel', model: loginModel },
        loginCmd.map((msg) => ({ _tag: 'LoginPageMsg', subMsg: msg })),
      ]
    }
    case 'SignupPage': {
      const [signupModel, signupCmd] = SignupPage.init(shared)
      return [
        { _tag: 'SignupPageModel', model: signupModel },
        signupCmd.map((msg) => ({ _tag: 'SignupPageMsg', subMsg: msg })),
      ]
    }
    case 'SettingsPage': {
      if (shared.user._tag === 'None') {
        return [{ _tag: 'NotFoundPageModel' }, Cmd.none()]
      }
      const [settingsModel, settingsCmd] = SettingsPage.init(shared.user.value)
      return [
        { _tag: 'SettingsPageModel', model: settingsModel },
        settingsCmd.map((msg) => ({
          _tag: 'SettingsPageMsg',
          subMsg: msg,
        })),
      ]
    }
    case 'ProfilePage': {
      const [profileModel, profileCmd] = ProfilePage.init(
        newRoute.page.username,
        newRoute.page.favorites,
        shared,
      )
      return [
        { _tag: 'ProfilePageModel', model: profileModel },
        profileCmd.map((msg) => ({
          _tag: 'ProfilePageMsg',
          subMsg: msg,
        })),
      ]
    }
    case 'EditorPage': {
      if (shared.user._tag === 'None') {
        return [{ _tag: 'NotFoundPageModel' }, Cmd.none()]
      }
      const [editorModel, editorCmd] = EditorPage.init(
        shared,
        newRoute.page.slug,
      )
      return [
        { _tag: 'EditorPageModel', model: editorModel },
        editorCmd.map((msg) => ({ _tag: 'EditorPageMsg', subMsg: msg })),
      ]
    }
    default:
      return [{ _tag: 'NotFoundPageModel' }, Cmd.none()]
  }
}

export const routerConfig = mkRouterConfig<PageModel, Msg>(initPageModel)

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'NoOp':
      return [model, Cmd.none()]
    case 'Init':
      return [model, Cmd.none()]
    case 'TeaRouterMsg':
      return routerMsgHandler(msg.subMsg, model)

    case 'SetUser': {
      const token =
        msg.user._tag === 'Some' ? O.some(msg.user.value.token) : O.none
      if (msg.user._tag === 'Some') {
        saveToken(msg.user.value.token)
      } else {
        removeToken()
      }
      const user: O.Option<User> = msg.user
      return [
        { ...model, shared: { ...model.shared, user, token } },
        Cmd.none(),
      ]
    }
    case 'HomePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag === 'HomePageModel') {
        const [homeModel, homeCmd] = HomePage.update(model.shared)(
          msg.subMsg,
          pageModel.model,
        )
        return pipe(
          [
            {
              ...model,
              router: TeaRouter.setPageModel(model.router, {
                _tag: 'HomePageModel',
                model: homeModel,
              }),
            },
            homeCmd.map((subMsg): Msg => ({
              _tag: 'HomePageMsg',
              subMsg,
            })),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (msg.subMsg._tag === 'ChangeTab') {
              return interceptChangeTabFromHomePage(msg.subMsg.tab)(m)
            }
            if (
              msg.subMsg._tag === 'PaginationMsg' &&
              msg.subMsg.subMsg._tag === 'ChangePage'
            ) {
              return interceptPaginationChangePageFromHomePage(
                msg.subMsg.subMsg.page,
              )(m)
            }
            return [m, Cmd.none()]
          }),
        )
      }
      return [model, Cmd.none()]
    }
    case 'ArticlePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag === 'ArticlePageModel') {
        const [articleModel, articleCmd] = ArticlePage.update(model.shared)(
          msg.subMsg,
          pageModel.model,
        )
        return pipe(
          [
            {
              ...model,
              router: TeaRouter.setPageModel(model.router, {
                _tag: 'ArticlePageModel',
                model: articleModel,
              }),
            },
            articleCmd.map(
              (m) => ({ _tag: 'ArticlePageMsg' as const, subMsg: m }) as Msg,
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.subMsg._tag === 'DeleteArticleResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              return routerMsgHandler(
                TeaRouter.ChangeRouteMsg({ page: homePage() }),
                m,
              )
            }
            return [m, Cmd.none()]
          }),
        )
      }
      return [model, Cmd.none()]
    }
    case 'LoginPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag === 'LoginPageModel') {
        const [loginModel, loginCmd] = LoginPage.update(model.shared)(
          msg.subMsg,
          pageModel.model,
        )

        return pipe(
          [
            {
              ...model,
              router: TeaRouter.setPageModel(model.router, {
                _tag: 'LoginPageModel',
                model: loginModel,
              }),
            },
            loginCmd.map(
              (m) => ({ _tag: 'LoginPageMsg' as const, subMsg: m }) as Msg,
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.subMsg._tag === 'SubmitResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              const userWithToken = msg.subMsg.result.value.user
              saveToken(userWithToken.token)
              const user: User = userWithToken
              const nextModel: Model = {
                ...m,
                shared: {
                  ...m.shared,
                  user: O.some(user),
                  token: O.some(userWithToken.token),
                },
              }
              return routerMsgHandler(
                TeaRouter.ChangeRouteMsg({ page: homePage() }),
                nextModel,
              )
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'SignupPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (pageModel._tag === 'SignupPageModel') {
        const [signupModel, signupCmd] = SignupPage.update(model.shared)(
          msg.subMsg,
          pageModel.model,
        )

        return pipe(
          [
            {
              ...model,
              router: TeaRouter.setPageModel(model.router, {
                _tag: 'SignupPageModel',
                model: signupModel,
              }),
            },
            signupCmd.map(
              (m) => ({ _tag: 'SignupPageMsg' as const, subMsg: m }) as Msg,
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.subMsg._tag === 'SubmitResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              const userWithToken = msg.subMsg.result.value.user
              saveToken(userWithToken.token)
              const user: User = userWithToken
              const nextModel: Model = {
                ...m,
                shared: {
                  ...m.shared,
                  user: O.some(user),
                  token: O.some(userWithToken.token),
                },
              }
              return routerMsgHandler(
                TeaRouter.ChangeRouteMsg({ page: homePage() }),
                nextModel,
              )
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'SettingsPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (
        pageModel._tag === 'SettingsPageModel' &&
        model.shared.user._tag === 'Some'
      ) {
        const [settingsModel, settingsCmd] = SettingsPage.update(model.shared)(
          msg.subMsg,
          pageModel.model,
        )

        return pipe(
          [
            {
              ...model,
              router: TeaRouter.setPageModel(model.router, {
                _tag: 'SettingsPageModel',
                model: settingsModel,
              }),
            },
            settingsCmd.map(
              (m) => ({ _tag: 'SettingsPageMsg' as const, subMsg: m }) as Msg,
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (msg.subMsg._tag === 'Logout') {
              return interceptLogoutFromSettingPage(m)
            } else if (
              msg.subMsg._tag === 'SubmitResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              return interceptSubmitResponseOkFromSettingPage(
                msg.subMsg.result.value.user,
              )(m)
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'ProfilePageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      const currentRoute = TeaRouter.getRoute(model.router)
      if (
        pageModel._tag === 'ProfilePageModel' &&
        currentRoute.page._tag === 'ProfilePage'
      ) {
        const username = currentRoute.page.username

        const [profileModel, profileCmd] = ProfilePage.update(
          username,
          model.shared,
        )(msg.subMsg, pageModel.model)

        return pipe(
          [
            {
              ...model,
              router: TeaRouter.setPageModel(model.router, {
                _tag: 'ProfilePageModel',
                model: profileModel,
              }),
            },
            profileCmd.map(
              (m) => ({ _tag: 'ProfilePageMsg' as const, subMsg: m }) as Msg,
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            // Intercept `ToggleFavorites` to update the url accordingly
            if (msg.subMsg._tag === 'ToggleFavorites') {
              const route: AppRoute = {
                page: {
                  _tag: 'ProfilePage',
                  username,
                  favorites: msg.subMsg.show,
                },
              }
              return routerMsgHandler(
                TeaRouter.ChangeRouteNoReloadMsg(route),
                m,
              )
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      }
      return [model, Cmd.none()]
    }
    case 'EditorPageMsg': {
      const pageModel = TeaRouter.getPageModel(model.router)
      if (
        pageModel._tag === 'EditorPageModel' &&
        model.shared.user._tag === 'Some'
      ) {
        const [editorModel, editorCmd] = EditorPage.update(model.shared)(
          msg.subMsg,
          pageModel.model,
        )

        return pipe(
          [
            {
              ...model,
              router: TeaRouter.setPageModel(model.router, {
                _tag: 'EditorPageModel',
                model: editorModel,
              }),
            },
            editorCmd.map(
              (m) => ({ _tag: 'EditorPageMsg' as const, subMsg: m }) as Msg,
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.subMsg._tag === 'SubmitResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              const slug = msg.subMsg.result.value.article.slug
              return routerMsgHandler(
                TeaRouter.ChangeRouteMsg({
                  page: { _tag: 'ArticlePage', slug },
                }),
                m,
              )
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'ChangeColorScheme':
      return changeColorSchemeHandler(msg.scheme)(model)
    case 'DebugPanelMsg':
      return [
        {
          ...model,
          debugPanel: DebugPanel.update(msg.subMsg, model.debugPanel),
        },
        Cmd.none(),
      ]
    case 'SidebarMsg':
      return sidebarMsgHandler(msg.subMsg, model)
    case 'NavbarMsg':
      return navbarMsgHandler(msg.subMsg, model)
  }
}

// Child Msg interception handler

const routerMsgHandler = (
  subMsg: Extract<Msg, { _tag: 'TeaRouterMsg' }>['subMsg'],
  model: Model,
): [Model, Cmd<Msg>] => {
  const prevRoute = TeaRouter.getRoute(model.router)
  const [routerModel, routerCmd] = TeaRouter.update(routerConfig, model.shared)(
    subMsg,
    model.router,
  )

  return pipe(
    [{ ...model, router: routerModel }, routerCmd] as [Model, Cmd<Msg>],
    updateAndCmd((m) => {
      const currentRoute = TeaRouter.getRoute(m.router)
      const isRouteChanged = !AppRouteEq.equals(prevRoute, currentRoute)
      if (isRouteChanged) {
        return [
          { ...m, sidebar: DsFloatingSidebar.init()[0] },
          trackVisitorCmd(m.shared.token, currentRoute),
        ]
      } else if (subMsg._tag === 'UrlChange') {
        return [{ ...m, sidebar: DsFloatingSidebar.init()[0] }, Cmd.none()]
      } else {
        return [m, Cmd.none()]
      }
    }),
  )
}

// Child Msg interception handler

const sidebarMsgHandler = (
  subMsg: Extract<Msg, { _tag: 'SidebarMsg' }>['subMsg'],
  model: Model,
): [Model, Cmd<Msg>] => {
  const [sidebarModel, sidebarCmd] = DsFloatingSidebar.update(subMsg)(
    model.sidebar,
  )

  return pipe(
    [
      { ...model, sidebar: sidebarModel },
      sidebarCmd.map((m): Msg => ({ _tag: 'SidebarMsg', subMsg: m })),
    ] as [Model, Cmd<Msg>],
    updateAndCmd((m) => {
      if (subMsg._tag === 'ClickItem') {
        const item = subMsg.item
        if (item.key === 'theme-light') {
          return changeColorSchemeHandler('light')(m)
        } else if (item.key === 'theme-dark') {
          return changeColorSchemeHandler('dark')(m)
        } else if (item.key === 'theme-auto') {
          return changeColorSchemeHandler('auto')(m)
        } else {
          const targetRoute = findNavItemRoute(m, item.key)
          if (targetRoute) {
            return routerMsgHandler(TeaRouter.ChangeRouteMsg(targetRoute), m)
          }
        }
      }
      return [m, Cmd.none()]
    }),
  )
}

// Child Msg interception handler

const navbarMsgHandler = (
  subMsg: Extract<Msg, { _tag: 'NavbarMsg' }>['subMsg'],
  model: Model,
): [Model, Cmd<Msg>] => {
  const [navbarModel, navbarCmd] = DsNavbar.update(subMsg)(model.navbar)

  return pipe(
    [
      { ...model, navbar: navbarModel },
      navbarCmd.map((m): Msg => ({ _tag: 'NavbarMsg', subMsg: m })),
    ] as [Model, Cmd<Msg>],
    updateAndCmd((m) => {
      if (subMsg._tag === 'ClickNavItem') {
        const item = subMsg.item
        if (item.key === 'toggle-sidebar') {
          const [sidebarModel, sidebarCmd] = DsFloatingSidebar.update({
            _tag: 'Toggle',
            open: true,
          })(m.sidebar)
          return [
            { ...m, sidebar: sidebarModel },
            sidebarCmd.map((subMsg) => ({
              _tag: 'SidebarMsg' as const,
              subMsg,
            })),
          ]
        } else if (item.key === 'theme-light') {
          return changeColorSchemeHandler('light')(m)
        } else if (item.key === 'theme-dark') {
          return changeColorSchemeHandler('dark')(m)
        } else if (item.key === 'theme-auto') {
          return changeColorSchemeHandler('auto')(m)
        } else {
          const targetRoute = findNavItemRoute(m, item.key)
          if (targetRoute) {
            return routerMsgHandler(TeaRouter.ChangeRouteMsg(targetRoute), m)
          }
        }
      }
      return [m, Cmd.none()]
    }),
  )
}

const changeColorSchemeHandler =
  (scheme: ColorScheme) =>
  (model: Model): [Model, Cmd<Msg>] => {
    return [
      { ...model, colorScheme: scheme },
      setColorSchemeCmd(scheme).map((subMsg): Msg => subMsg),
    ]
  }

// Child Msg interception handler

const interceptLogoutFromSettingPage = (m: Model): [Model, Cmd<Msg>] => {
  removeToken()
  const nextModel: Model = {
    ...m,
    shared: { ...m.shared, user: O.none, token: O.none },
  }
  return routerMsgHandler(
    TeaRouter.ChangeRouteMsg({ page: homePage() }),
    nextModel,
  )
}

const interceptSubmitResponseOkFromSettingPage =
  (userWithToken: UserWithToken) =>
  (m: Model): [Model, Cmd<Msg>] => {
    saveToken(userWithToken.token)
    const user: User = userWithToken
    // After a successful settings update, we redirect the user to their profile page
    // to see the changes. This matches the RealWorld spec and E2E test expectations.
    const nextModel: Model = {
      ...m,
      shared: {
        ...m.shared,
        user: O.some(user),
        token: O.some(userWithToken.token),
      },
    }
    return routerMsgHandler(
      TeaRouter.ChangeRouteMsg({
        page: {
          _tag: 'ProfilePage',
          username: user.username,
          favorites: false,
        },
      }),
      nextModel,
    )
  }

const interceptChangeTabFromHomePage =
  (tab: HomeTab) =>
  (m: Model): [Model, Cmd<Msg>] => {
    if (tab._tag === 'UserFeedTab' && m.shared.user._tag === 'None') {
      return routerMsgHandler(
        TeaRouter.ChangeRouteMsg({ page: { _tag: 'LoginPage' } }),
        m,
      )
    }
    // Change url according to the tab
    return routerMsgHandler(
      TeaRouter.ChangeRouteNoReloadMsg({ page: homePage(tab) }),
      m,
    )
  }

const interceptPaginationChangePageFromHomePage =
  (page: number) =>
  (m: Model): [Model, Cmd<Msg>] => {
    const currentRoute = TeaRouter.getRoute(m.router)
    if (currentRoute.page._tag === 'HomePage') {
      return routerMsgHandler(
        TeaRouter.ChangeRouteNoReloadMsg({
          page: homePage(currentRoute.page.tab, page),
        }),
        m,
      )
    }
    return [m, Cmd.none()]
  }

const trackVisitorCmd = (
  token: O.Option<string>,
  route: AppRoute,
): Cmd<Msg> => {
  const path = toUrlString(route)
  return Task.attempt(taskFromTE(trackVisitor(token, { path })), (): Msg => ({
    _tag: 'NoOp',
  }))
}
