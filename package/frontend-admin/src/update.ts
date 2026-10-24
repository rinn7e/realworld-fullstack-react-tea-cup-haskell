import { taskFromTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { Cmd, Task } from 'tea-cup-fp'

import { getCurrentUser } from '@/common/api'
import { getToken, removeToken, saveToken } from '@/common/cache'
import { type AuthUser } from '@/common/type/auth-user'
import {
  type AppRoute,
  AppRouteEq,
  pageHome,
  pageLogin,
  parseAppRoute,
} from '@/common/type/route'
import { type Shared } from '@/common/type/shared'
import * as Persona from '@/component/persona-panel'
import * as ArticlePage from '@/page/article-page'
import * as CommentPage from '@/page/comment-page'
import * as HomePage from '@/page/home-page'
import * as LoginPage from '@/page/login-page'
import * as UserPage from '@/page/user-page'
import * as VisitorPage from '@/page/visitor-page'

import { defaultTheme, themes } from './theme/data'
import { type ColorScheme, type Theme } from './theme/type'
import {
  injectTheme,
  loadColorScheme,
  loadThemeId,
  saveColorScheme,
  saveTheme,
} from './theme/util'
import { type Model, type Msg, type PageModel, pageModelToRoute } from './type'

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

export const initPageModel = (
  route: AppRoute,
  shared: Shared,
): [PageModel, Cmd<Msg>] => {
  switch (route.page._tag) {
    case 'PageHome': {
      const [m, c] = HomePage.init(shared)
      return [
        { _tag: 'HomePageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'HomePageMsg', subMsg })),
      ]
    }
    case 'PageLogin': {
      const [m, c] = LoginPage.init()
      return [
        { _tag: 'LoginPageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'LoginPageMsg', subMsg })),
      ]
    }
    case 'PageArticle': {
      const [m, c] = ArticlePage.init(shared)
      return [
        { _tag: 'ArticlePageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'ArticlePageMsg', subMsg })),
      ]
    }
    case 'PageUser': {
      const [m, c] = UserPage.init(shared)
      return [
        { _tag: 'UserPageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'UserPageMsg', subMsg })),
      ]
    }
    case 'PageComment': {
      const [m, c] = CommentPage.init(shared)
      return [
        { _tag: 'CommentPageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'CommentPageMsg', subMsg })),
      ]
    }
    case 'PageVisitor': {
      const [m, c] = VisitorPage.init(shared)
      return [
        { _tag: 'VisitorPageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'VisitorPageMsg', subMsg })),
      ]
    }
    case 'PageSetting':
      return [{ _tag: 'SettingPageModel' }, Cmd.none()]
    case 'PageNotFound':
      return [{ _tag: 'NotFoundPageModel' }, Cmd.none()]
  }
}

// Redirects a route the current session may not open: logged out -> login,
// logged in -> away from login
export const guardRoute = (route: AppRoute, shared: Shared): AppRoute => {
  const isLoggedIn = O.isSome(shared.user)
  const isRouteRequiredAuth = route.page._tag !== 'PageLogin'
  if (isRouteRequiredAuth && !isLoggedIn && O.isNone(shared.token)) {
    return { page: pageLogin() }
  } else if (route.page._tag === 'PageLogin' && isLoggedIn) {
    return { page: pageHome() }
  } else {
    return route
  }
}

export const init = (
  location: Location,
  user: O.Option<AuthUser>,
  isUnavailable: boolean,
  token: O.Option<string>,
): [Model, Cmd<Msg>] => {
  if (!isUnavailable && token._tag === 'None') {
    removeToken()
  }

  const shared: Shared = {
    user,
    token,
  }

  // Boot: the one place the URL is read (besides browser back / forward)
  const route = guardRoute(
    parseAppRoute(window.location.origin, location.href),
    shared,
  )
  const [pageModel, pageCmd] = initPageModel(route, shared)

  const [personaModel, personaCmd] = Persona.init()
  const colorScheme = loadColorScheme()
  const savedThemeId = loadThemeId()
  const theme = (savedThemeId ? themes[savedThemeId] : null) ?? defaultTheme

  const model: Model = {
    pageModel,
    shared,
    persona: personaModel,
    showScrollTop: false,
    theme,
    colorScheme,
  }

  const initCmd = Cmd.batch([
    pageCmd,
    personaCmd.map((subMsg): Msg => ({ _tag: 'PersonaMsg', subMsg })),
  ])

  return [model, initCmd]
}

export const initializeCmd = (location: Location): Cmd<Msg> => {
  const colorScheme = loadColorScheme()
  const savedThemeId = loadThemeId()
  const theme = (savedThemeId ? themes[savedThemeId] : null) ?? defaultTheme

  // Inject theme right on initialization to avoid flash of unstyled content
  injectTheme(theme, colorScheme)

  const storedToken = getToken()
  if (storedToken) {
    return Task.attempt(taskFromTE(getCurrentUser(storedToken)), (res): Msg => {
      const isUnavailable =
        res.tag === 'Err' &&
        (res.err.statusCode === 500 ||
          res.err.statusCode === 0 ||
          res.err.statusCode === 200)

      const token =
        res.tag === 'Ok'
          ? O.some(res.value.user.token)
          : isUnavailable
            ? O.some(storedToken)
            : O.none

      if (token._tag === 'Some') saveToken(token.value)
      else removeToken()

      return {
        _tag: 'Init',
        location,
        user:
          res.tag === 'Ok'
            ? O.some({
                email: res.value.user.email,
                token: res.value.user.token,
                username: res.value.user.username,
                bio: res.value.user.bio,
                image: res.value.user.image,
              })
            : O.none,
        isUnavailable,
        token,
      }
    })
  } else {
    return Task.perform(Task.succeed(undefined), (): Msg => ({
      _tag: 'Init',
      location,
      user: O.none,
      isUnavailable: false,
      token: O.none,
    }))
  }
}

// Opening a route always (re)initializes its page, also when it is the current
// one, so clicking the active sidebar link refreshes the page
export const navigateHandler = (
  route: AppRoute,
  model: Model,
): [Model, Cmd<Msg>] => {
  const guarded = guardRoute(route, model.shared)
  const [pageModel, pageCmd] = initPageModel(guarded, model.shared)
  return [{ ...model, pageModel }, pageCmd]
}

// Back / forward to the route already shown keeps the page as it is
const urlChangeHandler = (
  location: Location,
  model: Model,
): [Model, Cmd<Msg>] => {
  const route = guardRoute(
    parseAppRoute(window.location.origin, location.href),
    model.shared,
  )
  if (AppRouteEq.equals(route, pageModelToRoute(model.pageModel))) {
    return [model, Cmd.none()]
  } else {
    return navigateHandler(route, model)
  }
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'Navigate':
      return navigateHandler(msg.route, model)
    case 'UrlChange':
      return urlChangeHandler(msg.location, model)
    case 'Init':
      // Handled by preUpdate
      return [model, Cmd.none()]
    case 'Logout':
      return logoutHandler(model)
    case 'HomePageMsg':
      return homePageMsgHandler(msg.subMsg, model)
    case 'LoginPageMsg':
      return loginPageMsgHandler(msg.subMsg, model)
    case 'ArticlePageMsg':
      return articlesPageMsgHandler(msg.subMsg, model)
    case 'UserPageMsg':
      return usersPageMsgHandler(msg.subMsg, model)
    case 'CommentPageMsg':
      return commentsPageMsgHandler(msg.subMsg, model)
    case 'VisitorPageMsg':
      return visitorsPageMsgHandler(msg.subMsg, model)
    case 'PersonaMsg':
      return personaMsgHandler(msg.subMsg, model)
    case 'SetShowScrollTop':
      return [{ ...model, showScrollTop: msg.value }, Cmd.none()]
    case 'ScrollToTop':
      return scrollToTopHandler(model)
    case 'SwitchTheme':
      return switchThemeHandler(msg.theme, model)
    case 'SetColorScheme':
      return setColorSchemeHandler(msg.scheme, model)
    case 'NoOp':
      return [model, Cmd.none()]
  }
}

// Handlers
// ---------------------------------------------

const logoutHandler = (model: Model): [Model, Cmd<Msg>] => {
  removeToken()
  const nextModel: Model = {
    ...model,
    shared: {
      user: O.none,
      token: O.none,
    },
  }
  return navigateHandler({ page: pageLogin() }, nextModel)
}

const homePageMsgHandler = (
  subMsg: HomePage.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = model.pageModel
  if (pageModel._tag === 'HomePageModel') {
    const [m, c] = HomePage.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        pageModel: {
          _tag: 'HomePageModel',
          model: m,
        },
      },
      c.map((msg): Msg => ({ _tag: 'HomePageMsg', subMsg: msg })),
    ]
  } else {
    return [model, Cmd.none()]
  }
}

const loginPageMsgHandler = (
  subMsg: LoginPage.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = model.pageModel
  if (pageModel._tag === 'LoginPageModel') {
    const [m, c] = LoginPage.update(subMsg, pageModel.model)
    const nextModel: Model = {
      ...model,
      pageModel: {
        _tag: 'LoginPageModel',
        model: m,
      },
    }
    const nextCmd = c.map((msg): Msg => ({ _tag: 'LoginPageMsg', subMsg: msg }))

    if (subMsg._tag === 'SubmitResult' && subMsg.result.tag === 'Ok') {
      const user = subMsg.result.value.user
      saveToken(user.token)
      const updatedModel: Model = {
        ...nextModel,
        shared: {
          ...nextModel.shared,
          user: O.some({
            email: user.email,
            token: user.token,
            username: user.username,
            bio: user.bio,
            image: user.image,
          }),
          token: O.some(user.token),
        },
      }
      const [finalModel, navigateCmd] = navigateHandler(
        { page: pageHome() },
        updatedModel,
      )
      return [finalModel, Cmd.batch([nextCmd, navigateCmd])]
    } else {
      return [nextModel, nextCmd]
    }
  } else {
    return [model, Cmd.none()]
  }
}

const articlesPageMsgHandler = (
  subMsg: ArticlePage.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = model.pageModel
  if (pageModel._tag === 'ArticlePageModel') {
    const [m, c] = ArticlePage.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        pageModel: {
          _tag: 'ArticlePageModel',
          model: m,
        },
      },
      c.map((msg): Msg => ({ _tag: 'ArticlePageMsg', subMsg: msg })),
    ]
  } else {
    return [model, Cmd.none()]
  }
}

const usersPageMsgHandler = (
  subMsg: UserPage.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = model.pageModel
  if (pageModel._tag === 'UserPageModel') {
    const [m, c] = UserPage.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        pageModel: {
          _tag: 'UserPageModel',
          model: m,
        },
      },
      c.map((msg): Msg => ({ _tag: 'UserPageMsg', subMsg: msg })),
    ]
  } else {
    return [model, Cmd.none()]
  }
}

const commentsPageMsgHandler = (
  subMsg: CommentPage.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = model.pageModel
  if (pageModel._tag === 'CommentPageModel') {
    const [m, c] = CommentPage.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        pageModel: {
          _tag: 'CommentPageModel',
          model: m,
        },
      },
      c.map((msg): Msg => ({ _tag: 'CommentPageMsg', subMsg: msg })),
    ]
  } else {
    return [model, Cmd.none()]
  }
}

const visitorsPageMsgHandler = (
  subMsg: VisitorPage.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = model.pageModel
  if (pageModel._tag === 'VisitorPageModel') {
    const [m, c] = VisitorPage.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        pageModel: {
          _tag: 'VisitorPageModel',
          model: m,
        },
      },
      c.map((msg): Msg => ({ _tag: 'VisitorPageMsg', subMsg: msg })),
    ]
  } else {
    return [model, Cmd.none()]
  }
}

const personaMsgHandler = (
  subMsg: Persona.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const [m, c] = Persona.update(subMsg, model.persona)
  return [
    { ...model, persona: m },
    c.map((msg): Msg => ({ _tag: 'PersonaMsg', subMsg: msg })),
  ]
}

const scrollToTopHandler = (model: Model): [Model, Cmd<Msg>] => {
  return [
    model,
    Task.perform(
      Task.succeed(undefined).andThen(() => {
        document
          .getElementById('main-content')
          ?.scrollTo({ top: 0, behavior: 'smooth' })
        return Task.succeed(undefined)
      }),
      (): Msg => ({ _tag: 'NoOp' }),
    ),
  ]
}

const switchThemeHandler = (theme: Theme, model: Model): [Model, Cmd<Msg>] => {
  return [
    { ...model, theme },
    Task.perform(
      Task.succeed(undefined).andThen(() => {
        saveTheme(theme)
        injectTheme(theme, model.colorScheme)
        return Task.succeed(undefined)
      }),
      (): Msg => ({ _tag: 'NoOp' }),
    ),
  ]
}

const setColorSchemeHandler = (
  scheme: ColorScheme,
  model: Model,
): [Model, Cmd<Msg>] => {
  return [
    { ...model, colorScheme: scheme },
    Task.perform(
      Task.succeed(undefined).andThen(() => {
        saveColorScheme(scheme)
        injectTheme(model.theme, scheme)
        return Task.succeed(undefined)
      }),
      (): Msg => ({ _tag: 'NoOp' }),
    ),
  ]
}
