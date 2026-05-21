import { taskFromTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { newUrl } from 'react-tea-cup'
import { Cmd, Task } from 'tea-cup-fp'

import { getCurrentUser } from '@/common/api/handler/user'
import { getToken, removeToken, saveToken } from '@/common/cache'
import { type AppRoute, AppRouteEq } from '@/common/type/route'
import { parseAppRoute, toUrlString } from '@/common/util/route'
import type * as PersonaType from '@/component/persona-panel/type'
import * as Persona from '@/component/persona-panel/update'
import * as Articles from '@/page/articles'
import * as Comments from '@/page/comments'
import * as Home from '@/page/home'
import * as Login from '@/page/login'
import * as Users from '@/page/users'
import * as Visitors from '@/page/visitors'

import { defaultTheme, themes } from './theme/data'
import { type Theme } from './theme/type'
import {
  type ColorScheme,
  injectTheme,
  loadColorScheme,
  loadThemeId,
  saveColorScheme,
  saveTheme,
} from './theme/util'
import {
  type Model,
  type Msg,
  type PageModel,
  type Shared,
  type User,
} from './type'

export const initPageModel = (
  route: AppRoute,
  shared: Shared,
): [PageModel, Cmd<Msg>] => {
  switch (route.page._tag) {
    case 'HomePage': {
      const [m, c] = Home.init()
      return [
        { _tag: 'HomePageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'HomePageMsg', subMsg })),
      ]
    }
    case 'LoginPage': {
      const [m, c] = Login.init()
      return [
        { _tag: 'LoginPageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'LoginPageMsg', subMsg })),
      ]
    }
    case 'ArticlesPage': {
      const [m, c] = Articles.init(shared)
      return [
        { _tag: 'ArticlesPageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'ArticlesPageMsg', subMsg })),
      ]
    }
    case 'UsersPage': {
      const [m, c] = Users.init(shared)
      return [
        { _tag: 'UsersPageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'UsersPageMsg', subMsg })),
      ]
    }
    case 'CommentsPage': {
      const [m, c] = Comments.init(shared)
      return [
        { _tag: 'CommentsPageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'CommentsPageMsg', subMsg })),
      ]
    }
    case 'VisitorsPage': {
      const [m, c] = Visitors.init()
      return [
        { _tag: 'VisitorsPageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'VisitorsPageMsg', subMsg })),
      ]
    }
    case 'SettingsPage':
      return [{ _tag: 'SettingsPageModel' }, Cmd.none()]
    case 'NotFoundPage':
    default:
      return [{ _tag: 'NotFoundPageModel' }, Cmd.none()]
  }
}

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

export const init = (
  location: Location,
  user: O.Option<User>,
  isUnavailable: boolean,
  token: O.Option<string>,
): [Model, Cmd<Msg>] => {
  const route = parseAppRoute(window.location.origin, location.href)
  if (!isUnavailable && token._tag === 'None') {
    removeToken()
  }

  const [personaModel, personaCmd] = Persona.init()
  const colorScheme = loadColorScheme()
  const savedThemeId = loadThemeId()
  const theme = (savedThemeId ? themes[savedThemeId] : null) ?? defaultTheme

  const model: Model = {
    route,
    shared: {
      user,
      token,
    },
    pageModel: { _tag: 'NotFoundPageModel' },
    persona: personaModel,
    showScrollTop: false,
    theme,
    colorScheme,
    isInternal: false,
  }

  const [nextModel, navCmd] = navigate(route, false)(model)

  return [
    nextModel,
    Cmd.batch([
      navCmd,
      personaCmd.map((subMsg): Msg => ({ _tag: 'PersonaMsg', subMsg })),
    ]),
  ]
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
  }

  return Task.perform(
    Task.succeed(undefined),
    (): Msg => ({
      _tag: 'Init',
      location,
      user: O.none,
      isUnavailable: false,
      token: O.none,
    }),
  )
}

export const navigate =
  (newRoute: AppRoute, isInternal: boolean) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const urlCmd = isInternal
      ? Task.perform(
          newUrl(toUrlString(newRoute)),
          (): Msg => ({ _tag: 'NoOp' }),
        )
      : Cmd.none<Msg>()

    // Route Guard against unauth
    const isLoggedIn = O.isSome(model.shared.user)
    const isRouteRequiredAuth = newRoute.page._tag !== 'LoginPage'

    if (isRouteRequiredAuth && !isLoggedIn && O.isNone(model.shared.token)) {
      return navigate({ page: { _tag: 'LoginPage' } }, true)(model)
    }

    if (newRoute.page._tag === 'LoginPage' && isLoggedIn) {
      return navigate({ page: { _tag: 'HomePage' } }, true)(model)
    }

    const [pageModel, pageCmd] = initPageModel(newRoute, model.shared)

    const nextModel: Model = {
      ...model,
      isInternal,
      route: newRoute,
      pageModel,
    }

    return [nextModel, Cmd.batch([urlCmd, pageCmd])]
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

export const changeRouteHandler =
  (newRoute: AppRoute, isInternal: boolean) =>
  (model: Model): [Model, Cmd<Msg>] => {
    return execChangeRoute(newRoute, isInternal)(model)
  }

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
    return [
      {
        ...model,
        route,
        isInternal: true,
      },
      Task.perform(newUrl(url), (): Msg => ({ _tag: 'NoOp' })),
    ]
  }

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'UrlChange':
      return urlChangeHandler(msg.location, model)
    case 'ChangeRoute':
      return changeRouteHandler(msg.route, true)(model)
    case 'Init':
      // Handled by preUpdate
      return [model, Cmd.none()]
    case 'Logout':
      return logoutHandler(model)
    case 'HomePageMsg':
      return homePageMsgHandler(msg.subMsg, model)
    case 'LoginPageMsg':
      return loginPageMsgHandler(msg.subMsg, model)
    case 'ArticlesPageMsg':
      return articlesPageMsgHandler(msg.subMsg, model)
    case 'UsersPageMsg':
      return usersPageMsgHandler(msg.subMsg, model)
    case 'CommentsPageMsg':
      return commentsPageMsgHandler(msg.subMsg, model)
    case 'VisitorsPageMsg':
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

const urlChangeHandler = (
  location: Location,
  model: Model,
): [Model, Cmd<Msg>] => {
  if (model.isInternal) {
    return [
      {
        ...model,
        isInternal: false,
      },
      Cmd.none(),
    ]
  } else {
    const route = parseAppRoute(window.location.origin, location.href)
    return changeRouteHandler(route, false)(model)
  }
}

const logoutHandler = (model: Model): [Model, Cmd<Msg>] => {
  removeToken()
  const nextModel = {
    ...model,
    shared: {
      user: O.none,
      token: O.none,
    },
  }
  return changeRouteHandler({ page: { _tag: 'LoginPage' } }, true)(nextModel)
}

const homePageMsgHandler = (
  subMsg: Home.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  if (model.pageModel._tag === 'HomePageModel') {
    const [m, c] = Home.update(subMsg, model.pageModel.model)
    return [
      { ...model, pageModel: { ...model.pageModel, model: m } },
      c.map((msg): Msg => ({ _tag: 'HomePageMsg', subMsg: msg })),
    ]
  }
  return [model, Cmd.none()]
}

const loginPageMsgHandler = (
  subMsg: Login.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  if (model.pageModel._tag === 'LoginPageModel') {
    const [m, c] = Login.update(subMsg, model.pageModel.model)
    const nextModel = { ...model, pageModel: { ...model.pageModel, model: m } }
    const nextCmd = c.map((msg): Msg => ({ _tag: 'LoginPageMsg', subMsg: msg }))

    if (subMsg._tag === 'SubmitResult' && subMsg.result.tag === 'Ok') {
      const user = subMsg.result.value.user
      saveToken(user.token)
      const updatedModel = {
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
      const [finalModel, navCmd] = changeRouteHandler(
        { page: { _tag: 'HomePage' } },
        true,
      )(updatedModel)
      return [finalModel, Cmd.batch([nextCmd, navCmd])]
    }

    return [nextModel, nextCmd]
  }
  return [model, Cmd.none()]
}

const articlesPageMsgHandler = (
  subMsg: Articles.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  if (model.pageModel._tag === 'ArticlesPageModel') {
    const [m, c] = Articles.update(model.shared)(subMsg, model.pageModel.model)
    return [
      { ...model, pageModel: { ...model.pageModel, model: m } },
      c.map((msg): Msg => ({ _tag: 'ArticlesPageMsg', subMsg: msg })),
    ]
  }
  return [model, Cmd.none()]
}

const usersPageMsgHandler = (
  subMsg: Users.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  if (model.pageModel._tag === 'UsersPageModel') {
    const [m, c] = Users.update(model.shared)(subMsg, model.pageModel.model)
    return [
      { ...model, pageModel: { ...model.pageModel, model: m } },
      c.map((msg): Msg => ({ _tag: 'UsersPageMsg', subMsg: msg })),
    ]
  }
  return [model, Cmd.none()]
}

const commentsPageMsgHandler = (
  subMsg: Comments.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  if (model.pageModel._tag === 'CommentsPageModel') {
    const [m, c] = Comments.update(model.shared)(subMsg, model.pageModel.model)
    return [
      { ...model, pageModel: { ...model.pageModel, model: m } },
      c.map((msg): Msg => ({ _tag: 'CommentsPageMsg', subMsg: msg })),
    ]
  }
  return [model, Cmd.none()]
}

const visitorsPageMsgHandler = (
  subMsg: Visitors.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  if (model.pageModel._tag === 'VisitorsPageModel') {
    const [m, c] = Visitors.update(subMsg, model.pageModel.model)
    return [
      { ...model, pageModel: { ...model.pageModel, model: m } },
      c.map((msg): Msg => ({ _tag: 'VisitorsPageMsg', subMsg: msg })),
    ]
  }
  return [model, Cmd.none()]
}

const personaMsgHandler = (
  subMsg: PersonaType.Msg,
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
      () => ({ _tag: 'NoOp' }) as Msg,
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
      () => ({ _tag: 'NoOp' }) as Msg,
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
      () => ({ _tag: 'NoOp' }) as Msg,
    ),
  ]
}
