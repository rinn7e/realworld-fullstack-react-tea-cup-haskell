import {
  delayCmd,
  msgCmd,
  taskFromTE,
  updateAndCmd,
} from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { newUrl } from 'react-tea-cup'
import { Cmd, Task } from 'tea-cup-fp'

import {
  type User,
  type UserWithToken,
  getCurrentUser,
  trackVisitor,
} from '@/common/api'
import { getToken, removeToken, saveToken } from '@/common/cache'
import {
  type AppRoute,
  AppRouteEq,
  type HomeTab,
  homePage,
  parseAppRoute,
  toUrlString,
} from '@/common/type/route'
import * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import { findNavItemRoute, toNavbarConfig } from '@/common/nav-link-helper'
import * as DebugPanel from '@/component/debug-panel'
import * as Sidebar from '@/component/sidebar'
import * as ArticlePage from '@/page/article/update'
import * as EditorPage from '@/page/editor/update'
import * as HomePage from '@/page/home/update'
import * as LoginPage from '@/page/login/update'
import * as ProfilePage from '@/page/profile/update'
import * as SettingsPage from '@/page/settings/update'
import * as SignupPage from '@/page/signup/update'
import type { Model, Msg } from '@/type'

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
  const route = parseAppRoute('', location.href)
  if (!isUnavailable && token._tag === 'None') {
    removeToken()
  }
  const model: Model = {
    route,
    unavailableMode: isUnavailable,
    shared: {
      user,
      token,
    },
    pageModel: { _tag: 'NotFoundPageModel' },
    isInternal: false,
    debugPanel: DebugPanel.init(),
    sidebar: Sidebar.init(),
    navbar: DsNavbar.init()[0],
  }
  const initCmd = Cmd.batch([trackVisitorCmd(token, route)])

  return pipe([model, initCmd], updateAndCmd(navigate(route, true)))
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
export const initPageModel =
  (newRoute: AppRoute) =>
  (model: Model): [Model, Cmd<Msg>] => {
    switch (newRoute.page._tag) {
      case 'HomePage': {
        const [homeModel, homeCmd] = HomePage.init(
          newRoute.page.tab,
          newRoute.page.page,
          model.shared,
        )
        return [
          {
            ...model,
            route: newRoute,
            pageModel: { _tag: 'HomePageModel', model: homeModel },
            sidebar: Sidebar.init(),
          },
          homeCmd.map((msg) => ({ _tag: 'HomePageMsg', subMsg: msg })),
        ]
      }
      case 'ArticlePage': {
        const [articleModel, articleCmd] = ArticlePage.init(
          newRoute.page.slug,
          model.shared,
        )
        return [
          {
            ...model,
            route: newRoute,
            pageModel: { _tag: 'ArticlePageModel', model: articleModel },
            sidebar: Sidebar.init(),
          },
          articleCmd.map((msg) => ({
            _tag: 'ArticlePageMsg',
            subMsg: msg,
          })),
        ]
      }
      case 'LoginPage': {
        const [loginModel, loginCmd] = LoginPage.init(model.shared)
        return [
          {
            ...model,
            route: newRoute,
            pageModel: { _tag: 'LoginPageModel', model: loginModel },
            sidebar: Sidebar.init(),
          },
          loginCmd.map((msg) => ({ _tag: 'LoginPageMsg', subMsg: msg })),
        ]
      }
      case 'SignupPage': {
        const [signupModel, signupCmd] = SignupPage.init(model.shared)
        return [
          {
            ...model,
            route: newRoute,
            pageModel: { _tag: 'SignupPageModel', model: signupModel },
            sidebar: Sidebar.init(),
          },
          signupCmd.map((msg) => ({ _tag: 'SignupPageMsg', subMsg: msg })),
        ]
      }
      case 'SettingsPage': {
        if (model.shared.user._tag === 'None') {
          return [model, Cmd.none()]
        }
        const [settingsModel, settingsCmd] = SettingsPage.init(
          model.shared.user.value,
        )
        return [
          {
            ...model,
            route: newRoute,
            pageModel: { _tag: 'SettingsPageModel', model: settingsModel },
            sidebar: Sidebar.init(),
          },
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
          model.shared,
        )
        return [
          {
            ...model,
            route: newRoute,
            pageModel: { _tag: 'ProfilePageModel', model: profileModel },
            sidebar: Sidebar.init(),
          },
          profileCmd.map((msg) => ({
            _tag: 'ProfilePageMsg',
            subMsg: msg,
          })),
        ]
      }
      case 'EditorPage': {
        if (model.shared.user._tag === 'None') {
          return [model, Cmd.none()]
        }
        const [editorModel, editorCmd] = EditorPage.init(
          model.shared,
          newRoute.page.slug,
        )
        return [
          {
            ...model,
            route: newRoute,
            pageModel: { _tag: 'EditorPageModel', model: editorModel },
            sidebar: Sidebar.init(),
          },
          editorCmd.map((msg) => ({ _tag: 'EditorPageMsg', subMsg: msg })),
        ]
      }
      default:
        return [
          {
            ...model,
            route: newRoute,
            pageModel: { _tag: 'NotFoundPageModel' },
            sidebar: Sidebar.init(),
          },
          Cmd.none(),
        ]
    }
  }

const navigate =
  (newRoute: AppRoute, isInternal: boolean) =>
  (model: Model): [Model, Cmd<Msg>] => {
    // AppRoute Guard against unauth
    // TODO: consider where to put the auth guard
    // maybe in changeRouterHandler instead
    const isLoggedIn = O.isSome(model.shared.user)

    const isRouteRequiredAuth =
      newRoute.page._tag === 'SettingsPage' ||
      newRoute.page._tag === 'EditorPage' ||
      (newRoute.page._tag === 'HomePage' &&
        newRoute.page.tab._tag === 'UserFeedTab')

    if (isRouteRequiredAuth && !isLoggedIn) {
      return navigate({ page: { _tag: 'LoginPage' } }, true)(model)
    }

    const [updatedModel, updatedCmd] = initPageModel(newRoute)(model)

    const urlCmd = isInternal
      ? Task.perform(newUrl(toUrlString(newRoute)), (): Msg => ({
          _tag: 'NoOp',
        }))
      : Cmd.none<Msg>()

    const trackCmd = trackVisitorCmd(model.shared.token, newRoute)

    return [
      {
        ...updatedModel,
        isInternal,
      },
      Cmd.batch([urlCmd, updatedCmd, trackCmd]),
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

// Handlers
// ---------------------------------------------

// Modify the URL in the address bar without updating the route in the Model.
// Sets `isInternal` to true to prevent re-navigation when the URL change is detected.
// useful when we want to update the url to match app state
export const changeRouteUrlNoReload =
  (route: AppRoute) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const url = toUrlString(route)
    return [
      {
        ...model,
        isInternal: true,
      },
      Task.perform(newUrl(url), (): Msg => ({ _tag: 'NoOp' })),
    ]
  }

// Modify the URL in the address bar and also update the route in the Model.
// Sets `isInternal` to true to prevent re-navigation when the URL change is detected.
// useful when we want to update the route,and url to match app state
export const changeRouteNoReload =
  (route: AppRoute) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const url = toUrlString(route)
    const trackCmd = trackVisitorCmd(model.shared.token, route)
    return [
      {
        ...model,
        route,
        isInternal: true,
      },
      Cmd.batch([
        Task.perform(newUrl(url), (): Msg => ({ _tag: 'NoOp' })),
        trackCmd,
      ]),
    ]
  }

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'NoOp':
      return [model, Cmd.none()]
    case 'Init':
      // Handled by preUpdate
      return [model, Cmd.none()]
    case 'UrlChange': {
      if (model.isInternal) {
        return [
          {
            ...model,
            isInternal: false,
            sidebar: Sidebar.init(),
          },
          Cmd.none(),
        ]
      } else {
        const route = parseAppRoute('', msg.location.href)
        return changeRouteHandler(route, false)(model)
      }
    }
    case 'ChangeRoute': {
      return changeRouteHandler(msg.route, true)(model)
    }

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
    case 'HomePageMsg':
      if (model.pageModel._tag === 'HomePageModel') {
        const [homeModel, homeCmd] = HomePage.update(model.shared)(
          msg.subMsg,
          model.pageModel.model,
        )
        return pipe(
          [
            {
              ...model,
              pageModel: { _tag: 'HomePageModel', model: homeModel },
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
    case 'ArticlePageMsg':
      if (model.pageModel._tag === 'ArticlePageModel') {
        const [articleModel, articleCmd] = ArticlePage.update(model.shared)(
          msg.subMsg,
          model.pageModel.model,
        )
        return pipe(
          [
            {
              ...model,
              pageModel: {
                _tag: 'ArticlePageModel',
                model: articleModel,
              } as const,
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
              return changeRouteHandler({ page: homePage() }, true)(m)
            }
            return [m, Cmd.none()]
          }),
        )
      }
      return [model, Cmd.none()]
    case 'LoginPageMsg': {
      if (model.pageModel._tag === 'LoginPageModel') {
        const [loginModel, loginCmd] = LoginPage.update(model.shared)(
          msg.subMsg,
          model.pageModel.model,
        )

        return pipe(
          [
            {
              ...model,
              pageModel: { _tag: 'LoginPageModel', model: loginModel } as const,
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
              return changeRouteHandler(
                { page: homePage() },
                true,
              )({
                ...m,
                shared: {
                  ...m.shared,
                  user: O.some(user),
                  token: O.some(userWithToken.token),
                },
              })
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
      if (model.pageModel._tag === 'SignupPageModel') {
        const [signupModel, signupCmd] = SignupPage.update(model.shared)(
          msg.subMsg,
          model.pageModel.model,
        )

        return pipe(
          [
            {
              ...model,
              pageModel: {
                _tag: 'SignupPageModel',
                model: signupModel,
              } as const,
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
              return changeRouteHandler(
                { page: homePage() },
                true,
              )({
                ...m,
                shared: {
                  ...m.shared,
                  user: O.some(user),
                  token: O.some(userWithToken.token),
                },
              })
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
      if (
        model.pageModel._tag === 'SettingsPageModel' &&
        model.shared.user._tag === 'Some'
      ) {
        const [settingsModel, settingsCmd] = SettingsPage.update(model.shared)(
          msg.subMsg,
          model.pageModel.model,
        )

        return pipe(
          [
            {
              ...model,
              pageModel: {
                _tag: 'SettingsPageModel',
                model: settingsModel,
              } as const,
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
    case 'ProfilePageMsg':
      if (
        model.pageModel._tag === 'ProfilePageModel' &&
        model.route.page._tag === 'ProfilePage'
      ) {
        const username = model.route.page.username

        const [profileModel, profileCmd] = ProfilePage.update(
          username,
          model.shared,
        )(msg.subMsg, model.pageModel.model)

        return pipe(
          [
            {
              ...model,
              pageModel: { _tag: 'ProfilePageModel', model: profileModel },
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
              return changeRouteNoReload(route)(m)
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      }
      return [model, Cmd.none()]
    case 'EditorPageMsg': {
      if (
        model.pageModel._tag === 'EditorPageModel' &&
        model.shared.user._tag === 'Some'
      ) {
        const [editorModel, editorCmd] = EditorPage.update(model.shared)(
          msg.subMsg,
          model.pageModel.model,
        )

        return pipe(
          [
            {
              ...model,
              pageModel: {
                _tag: 'EditorPageModel',
                model: editorModel,
              } as const,
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
              return changeRouteHandler(
                { page: { _tag: 'ArticlePage', slug } },
                true,
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
    case 'DebugPanelMsg':
      return [
        {
          ...model,
          debugPanel: DebugPanel.update(msg.subMsg, model.debugPanel),
        },
        Cmd.none(),
      ]
    case 'SidebarMsg': {
      const [sidebarModel, sidebarCmd] = Sidebar.update(
        msg.subMsg,
        model.sidebar,
      )
      return [
        {
          ...model,
          sidebar: sidebarModel,
        },
        sidebarCmd.map((subMsg) => ({ _tag: 'SidebarMsg', subMsg })),
      ]
    }
    case 'NavbarMsg':
      return navbarMsgHandler(msg.subMsg, model)
  }
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
          const [sidebarModel, sidebarCmd] = Sidebar.update(
            { _tag: 'Toggle', open: true },
            m.sidebar,
          )
          return [
            { ...m, sidebar: sidebarModel },
            sidebarCmd.map((subMsg) => ({ _tag: 'SidebarMsg' as const, subMsg })),
          ]
        } else {
          const targetRoute = findNavItemRoute(m, item.key)
          if (targetRoute) {
            return changeRouteHandler(targetRoute, true)(m)
          }
        }
      }
      return [m, Cmd.none()]
    }),
  )
}

// Child Msg interception handler

const interceptLogoutFromSettingPage = (m: Model): [Model, Cmd<Msg>] => {
  removeToken()
  return changeRouteHandler(
    { page: homePage() },
    true,
  )({ ...m, shared: { ...m.shared, user: O.none, token: O.none } })
}

const interceptSubmitResponseOkFromSettingPage =
  (userWithToken: UserWithToken) =>
  (m: Model): [Model, Cmd<Msg>] => {
    saveToken(userWithToken.token)
    const user: User = userWithToken
    // After a successful settings update, we redirect the user to their profile page
    // to see the changes. This matches the RealWorld spec and E2E test expectations.
    return changeRouteHandler(
      {
        page: {
          _tag: 'ProfilePage',
          username: user.username,
          favorites: false,
        },
      },
      true,
    )({
      ...m,
      shared: {
        ...m.shared,
        user: O.some(user),
        token: O.some(userWithToken.token),
      },
    })
  }
const interceptChangeTabFromHomePage =
  (tab: HomeTab) =>
  (m: Model): [Model, Cmd<Msg>] => {
    if (tab._tag === 'UserFeedTab' && m.shared.user._tag === 'None') {
      return changeRouteHandler({ page: { _tag: 'LoginPage' } }, true)(m)
    }
    // Change url according to the tab
    else return changeRouteNoReload({ page: homePage(tab) })(m)
  }

const interceptPaginationChangePageFromHomePage =
  (page: number) =>
  (m: Model): [Model, Cmd<Msg>] => {
    if (m.route.page._tag === 'HomePage') {
      return changeRouteNoReload({
        page: homePage(m.route.page.tab, page),
      })(m)
    }
    return [m, Cmd.none()]
  }

const _getUserCmd = (storedToken: string): Cmd<Msg> =>
  Task.attempt(taskFromTE(getCurrentUser(storedToken)), (res) => {
    const msg: Msg = {
      _tag: 'SetUser',
      user: res.tag === 'Ok' ? O.some(res.value.user) : O.none,
    }
    return msg
  })

const trackVisitorCmd = (
  token: O.Option<string>,
  route: AppRoute,
): Cmd<Msg> => {
  const path = toUrlString(route)
  return Task.attempt(taskFromTE(trackVisitor(token, { path })), (): Msg => ({
    _tag: 'NoOp',
  }))
}
