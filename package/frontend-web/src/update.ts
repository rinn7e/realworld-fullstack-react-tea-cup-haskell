import * as DsFloatingSidebar from '@rinn7e/realworld-design-system/component/floating-sidebar'
import * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import { msgCmd, taskFromTE, updateAndCmd } from '@rinn7e/tea-cup-prelude'
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
import {
  type AppRoute,
  AppRouteEq,
  type HomeTab,
  pageHome,
  pageLogin,
  parseAppRoute,
  toUrlString,
} from '@/common/type/route'
import { type Shared } from '@/common/type/shared'
import { pushUrl, replaceUrl } from '@/common/util/url'
import * as DebugPanel from '@/component/debug-panel'
import * as ArticlePage from '@/page/article-page'
import * as EditorPage from '@/page/editor-page'
import * as HomePage from '@/page/home-page'
import * as LoginPage from '@/page/login-page'
import * as ProfilePage from '@/page/profile-page'
import * as SettingsPage from '@/page/settings-page'
import * as SignupPage from '@/page/signup-page'
import type { ColorScheme } from '@/theme/type'
import { loadColorScheme, setColorSchemeCmd } from '@/theme/util'
import { type Model, type Msg, type PageModel, pageModelToRoute } from '@/type'

import { findNavItemRoute } from './navbar/util'

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
    } else {
      return [null, Cmd.none()]
    }
  } else {
    return update(msg, model)
  }
}

// Init, Update
// ---------------------------------------------

export const init = (
  location: Location,
  user: O.Option<User>,
  isUnavailable: boolean,
  token: O.Option<string>,
): [Model, Cmd<Msg>] => {
  // The stored token is not touched here: `initializeCmd` already saved or
  // removed it from the server's answer, and with no stored token there is
  // nothing to remove. Removing it here raced with a token saved between
  // page load and this delayed `Init` (e.g. by a test), and wiped it.
  const initialColorScheme = loadColorScheme()
  const shared = { user, token }
  // Boot: the one place the URL is read (besides browser back / forward)
  const route = guardRoute(parseAppRoute('', location.href), shared)
  const [pageModel, pageCmd] = initPageModel(route, shared)

  const model: Model = {
    pageModel,
    unavailableMode: isUnavailable,
    shared,
    debugPanel: DebugPanel.init(),
    sidebar: DsFloatingSidebar.init()[0],
    navbar: DsNavbar.init()[0],
    colorScheme: initialColorScheme,
  }
  const initCmd = Cmd.batch([
    pageCmd,
    trackVisitorCmd(token, route),
    setColorSchemeCmd(initialColorScheme).map((): Msg => ({ _tag: 'NoOp' })),
    // Replace, so a guard redirect leaves no history entry to bounce off
    replaceUrl(route).map(noOpToMsg),
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
        user: res.tag === 'Ok' ? O.some<User>(res.value.user) : O.none,
        isUnavailable,
        token: token,
      }
    })
  } else {
    return msgCmd({
      _tag: 'Init',
      location,
      user: O.none,
      isUnavailable: false,
      token: O.none,
    })
  }
}

export const initPageModel = (
  route: AppRoute,
  shared: Shared,
): [PageModel, Cmd<Msg>] => {
  switch (route.page._tag) {
    case 'PageHome': {
      const [model, cmd] = HomePage.init(
        route.page.tab,
        route.page.page,
        shared,
      )
      return [
        { _tag: 'HomePageModel', model },
        cmd.map((m): Msg => ({ _tag: 'HomePageMsg', subMsg: m })),
      ]
    }
    case 'PageArticle': {
      const [model, cmd] = ArticlePage.init(route.page.slug, shared)
      return [
        { _tag: 'ArticlePageModel', model },
        cmd.map((m): Msg => ({ _tag: 'ArticlePageMsg', subMsg: m })),
      ]
    }
    case 'PageLogin': {
      const [model, cmd] = LoginPage.init(shared)
      return [
        { _tag: 'LoginPageModel', model },
        cmd.map((m): Msg => ({ _tag: 'LoginPageMsg', subMsg: m })),
      ]
    }
    case 'PageSignup': {
      const [model, cmd] = SignupPage.init(shared)
      return [
        { _tag: 'SignupPageModel', model },
        cmd.map((m): Msg => ({ _tag: 'SignupPageMsg', subMsg: m })),
      ]
    }
    case 'PageSettings': {
      if (shared.user._tag === 'None') {
        return [{ _tag: 'NotFoundPageModel' }, Cmd.none()]
      } else {
        const [model, cmd] = SettingsPage.init(shared.user.value)
        return [
          { _tag: 'SettingsPageModel', model },
          cmd.map((m): Msg => ({ _tag: 'SettingsPageMsg', subMsg: m })),
        ]
      }
    }
    case 'PageProfile': {
      const [model, cmd] = ProfilePage.init(
        route.page.username,
        route.page.favorites,
        shared,
      )
      return [
        { _tag: 'ProfilePageModel', model },
        cmd.map((m): Msg => ({ _tag: 'ProfilePageMsg', subMsg: m })),
      ]
    }
    case 'PageEditor': {
      if (shared.user._tag === 'None') {
        return [{ _tag: 'NotFoundPageModel' }, Cmd.none()]
      } else {
        const [model, cmd] = EditorPage.init(shared, route.page.slug)
        return [
          { _tag: 'EditorPageModel', model },
          cmd.map((m): Msg => ({ _tag: 'EditorPageMsg', subMsg: m })),
        ]
      }
    }
    default:
      return [{ _tag: 'NotFoundPageModel' }, Cmd.none()]
  }
}

// Redirects a route the current session may not open: pages that need a user
// -> login, login and signup when logged in -> home
export const guardRoute = (route: AppRoute, shared: Shared): AppRoute => {
  const isLoggedIn = O.isSome(shared.user)
  const requiresAuth =
    route.page._tag === 'PageSettings' ||
    route.page._tag === 'PageEditor' ||
    (route.page._tag === 'PageHome' && route.page.tab._tag === 'UserFeedTab')

  if (requiresAuth && !isLoggedIn) {
    return { page: pageLogin() }
  } else {
    const requiresGuest =
      route.page._tag === 'PageLogin' || route.page._tag === 'PageSignup'

    if (requiresGuest && isLoggedIn) {
      return { page: pageHome() }
    } else {
      return route
    }
  }
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'NoOp':
      return [model, Cmd.none()]
    case 'Init':
      return [model, Cmd.none()]
    case 'Navigate':
      return navigateHandler(msg.route, model)
    case 'UrlChanged':
      return urlChangedHandler(msg.url, model)

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
        {
          ...model,
          shared: {
            ...model.shared,
            user,
            token,
          },
        },
        Cmd.none(),
      ]
    }
    case 'HomePageMsg': {
      const pageModel = model.pageModel
      if (pageModel._tag === 'HomePageModel') {
        const prevRoute = pageModelToRoute(pageModel)
        const [homeModel, homeCmd] = HomePage.update(model.shared)(
          msg.subMsg,
          pageModel.model,
        )
        return pipe(
          [
            withPageModel(model, { _tag: 'HomePageModel', model: homeModel }),
            homeCmd.map((subMsg): Msg => ({
              _tag: 'HomePageMsg',
              subMsg,
            })),
          ] satisfies [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (msg.subMsg._tag === 'ChangeTab') {
              return interceptChangeTabFromHomePage(
                prevRoute,
                msg.subMsg.tab,
              )(m)
            } else if (
              msg.subMsg._tag === 'PaginationMsg' &&
              msg.subMsg.subMsg._tag === 'ChangePage'
            ) {
              return pageRouteChangedHandler(prevRoute)(m)
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'ArticlePageMsg': {
      const pageModel = model.pageModel
      if (pageModel._tag === 'ArticlePageModel') {
        const [articleModel, articleCmd] = ArticlePage.update(model.shared)(
          msg.subMsg,
          pageModel.model,
        )
        return pipe(
          [
            withPageModel(model, {
              _tag: 'ArticlePageModel',
              model: articleModel,
            }),
            articleCmd.map((m): Msg => ({ _tag: 'ArticlePageMsg', subMsg: m })),
          ] satisfies [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.subMsg._tag === 'DeleteArticleResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              return navigateHandler({ page: pageHome() }, m)
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'LoginPageMsg': {
      const pageModel = model.pageModel
      if (pageModel._tag === 'LoginPageModel') {
        const [loginModel, loginCmd] = LoginPage.update(model.shared)(
          msg.subMsg,
          pageModel.model,
        )

        return pipe(
          [
            withPageModel(model, { _tag: 'LoginPageModel', model: loginModel }),
            loginCmd.map((m): Msg => ({ _tag: 'LoginPageMsg', subMsg: m })),
          ] satisfies [Model, Cmd<Msg>],
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
              return navigateHandler({ page: pageHome() }, nextModel)
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
      const pageModel = model.pageModel
      if (pageModel._tag === 'SignupPageModel') {
        const [signupModel, signupCmd] = SignupPage.update(model.shared)(
          msg.subMsg,
          pageModel.model,
        )

        return pipe(
          [
            withPageModel(model, {
              _tag: 'SignupPageModel',
              model: signupModel,
            }),
            signupCmd.map((m): Msg => ({ _tag: 'SignupPageMsg', subMsg: m })),
          ] satisfies [Model, Cmd<Msg>],
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
              return navigateHandler({ page: pageHome() }, nextModel)
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
      const pageModel = model.pageModel
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
            withPageModel(model, {
              _tag: 'SettingsPageModel',
              model: settingsModel,
            }),
            settingsCmd.map((m): Msg => ({
              _tag: 'SettingsPageMsg',
              subMsg: m,
            })),
          ] satisfies [Model, Cmd<Msg>],
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
      const pageModel = model.pageModel
      if (pageModel._tag === 'ProfilePageModel') {
        const prevRoute = pageModelToRoute(pageModel)
        const [profileModel, profileCmd] = ProfilePage.update(model.shared)(
          msg.subMsg,
          pageModel.model,
        )

        return pipe(
          [
            withPageModel(model, {
              _tag: 'ProfilePageModel',
              model: profileModel,
            }),
            profileCmd.map((m): Msg => ({ _tag: 'ProfilePageMsg', subMsg: m })),
          ] satisfies [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            // Intercept `ToggleFavorites` to update the url accordingly
            if (msg.subMsg._tag === 'ToggleFavorites') {
              return pageRouteChangedHandler(prevRoute)(m)
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'EditorPageMsg': {
      const pageModel = model.pageModel
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
            withPageModel(model, {
              _tag: 'EditorPageModel',
              model: editorModel,
            }),
            editorCmd.map((m): Msg => ({ _tag: 'EditorPageMsg', subMsg: m })),
          ] satisfies [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.subMsg._tag === 'SubmitResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              const slug = msg.subMsg.result.value.article.slug
              return navigateHandler({ page: { _tag: 'PageArticle', slug } }, m)
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

// Navigation handlers

// Sets the open page; typed as `Model` so a page handler's result is not
// narrowed to one page
const withPageModel = (model: Model, pageModel: PageModel): Model => ({
  ...model,
  pageModel,
})

const noOpToMsg = (noOp: { _tag: 'NoOp' }): Msg => noOp

// (Re)initializes the page of an already guarded route; the caller adds the URL
// write
const openPage = (route: AppRoute, model: Model): [Model, Cmd<Msg>] => {
  const [pageModel, pageCmd] = initPageModel(route, model.shared)
  return [{ ...model, pageModel }, pageCmd]
}

// What every move to another route does besides the page itself: close the
// sidebar and record the visit
const routeChangedHandler =
  (route: AppRoute) =>
  (model: Model): [Model, Cmd<Msg>] => [
    { ...model, sidebar: DsFloatingSidebar.init()[0] },
    trackVisitorCmd(model.shared.token, route),
  ]

// Opening a route always (re)initializes its page, also when it is the current
// one, so clicking the active link refreshes the page. `pushUrl` skips the
// write when the URL is already shown, so that adds no history entry. The
// sidebar closes on every navigation, as it did with the old router (whose
// `popstate` echo reset it); only a real route change records a visit.
export const navigateHandler = (
  route: AppRoute,
  model: Model,
): [Model, Cmd<Msg>] => {
  const guarded = guardRoute(route, model.shared)
  const isRouteChanged = !AppRouteEq.equals(
    pageModelToRoute(model.pageModel),
    guarded,
  )
  return pipe(
    openPage(guarded, model),
    updateAndCmd((m) =>
      isRouteChanged
        ? routeChangedHandler(guarded)(m)
        : [{ ...m, sidebar: DsFloatingSidebar.init()[0] }, Cmd.none()],
    ),
    updateAndCmd((m) => [m, pushUrl(guarded).map(noOpToMsg)]),
  )
}

// Back / forward to the route already shown keeps the page as it is (but still
// closes the sidebar). The URL is replaced, never pushed, also when the guard
// redirected it: the URL must show the page, and a push would cut off the
// forward history.
export const urlChangedHandler = (
  url: URL,
  model: Model,
): [Model, Cmd<Msg>] => {
  const route = guardRoute(parseAppRoute('', url.href), model.shared)
  const opened: [Model, Cmd<Msg>] = AppRouteEq.equals(
    route,
    pageModelToRoute(model.pageModel),
  )
    ? [{ ...model, sidebar: DsFloatingSidebar.init()[0] }, Cmd.none()]
    : pipe(openPage(route, model), updateAndCmd(routeChangedHandler(route)))
  return pipe(
    opened,
    updateAndCmd((m) => [m, replaceUrl(route).map(noOpToMsg)]),
  )
}

// A page changed its own route params without reloading (home tab or page,
// profile favorites): its model already shows the new route, so only the URL
// and the route-change effects follow
const pageRouteChangedHandler =
  (prevRoute: AppRoute) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const route = pageModelToRoute(model.pageModel)
    if (AppRouteEq.equals(prevRoute, route)) {
      return [model, Cmd.none()]
    } else {
      return pipe(
        routeChangedHandler(route)(model),
        updateAndCmd((m) => [m, pushUrl(route).map(noOpToMsg)]),
      )
    }
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
    ] satisfies [Model, Cmd<Msg>],
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
            return navigateHandler(targetRoute, m)
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
    ] satisfies [Model, Cmd<Msg>],
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
            return navigateHandler(targetRoute, m)
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
  return navigateHandler({ page: pageHome() }, nextModel)
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
    return navigateHandler(
      {
        page: {
          _tag: 'PageProfile',
          username: user.username,
          favorites: false,
        },
      },
      nextModel,
    )
  }

const interceptChangeTabFromHomePage =
  (prevRoute: AppRoute, tab: HomeTab) =>
  (m: Model): [Model, Cmd<Msg>] => {
    if (tab._tag === 'UserFeedTab' && m.shared.user._tag === 'None') {
      return navigateHandler({ page: pageLogin() }, m)
    } else {
      // Change url according to the tab
      return pageRouteChangedHandler(prevRoute)(m)
    }
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
