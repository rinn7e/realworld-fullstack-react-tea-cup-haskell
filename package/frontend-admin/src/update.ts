import { taskFromTE } from '@rinn7e/tea-cup-prelude'
import * as TeaRouter from '@rinn7e/tea-cup-router'
import * as O from 'fp-ts/lib/Option'
import { Cmd, Task } from 'tea-cup-fp'

import { getCurrentUser } from '@/common/api/handler/user'
import { getToken, removeToken, saveToken } from '@/common/cache'
import { mkRouterConfig } from '@/common/router'
import { type AuthUser } from '@/common/type/auth-user'
import { type AppRoute } from '@/common/type/route'
import { type Shared } from '@/common/type/shared'
import type * as PersonaType from '@/component/persona-panel/type'
import * as Persona from '@/component/persona-panel/update'
import * as Articles from '@/page/article'
import * as Comments from '@/page/comment'
import * as Home from '@/page/home'
import * as Login from '@/page/login'
import * as Users from '@/page/user'
import * as Visitors from '@/page/visitor'

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
import { type Model, type Msg, type PageModel } from './type'

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

export const initPageModel = (
  route: AppRoute,
  shared: Shared,
): [PageModel, Cmd<Msg>] => {
  switch (route.page._tag) {
    case 'HomePage': {
      const [m, c] = Home.init(shared)
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
    case 'ArticlePage': {
      const [m, c] = Articles.init(shared)
      return [
        { _tag: 'ArticlePageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'ArticlePageMsg', subMsg })),
      ]
    }
    case 'UserPage': {
      const [m, c] = Users.init(shared)
      return [
        { _tag: 'UserPageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'UserPageMsg', subMsg })),
      ]
    }
    case 'CommentPage': {
      const [m, c] = Comments.init(shared)
      return [
        { _tag: 'CommentPageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'CommentPageMsg', subMsg })),
      ]
    }
    case 'VisitorPage': {
      const [m, c] = Visitors.init(shared)
      return [
        { _tag: 'VisitorPageModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'VisitorPageMsg', subMsg })),
      ]
    }
    case 'SettingPage':
      return [{ _tag: 'SettingPageModel' }, Cmd.none()]
    case 'NotFoundPage':
    default:
      return [{ _tag: 'NotFoundPageModel' }, Cmd.none()]
  }
}

export const routerConfig = mkRouterConfig<PageModel, Msg>(initPageModel)

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

  const [routerModel, routerCmd] = TeaRouter.init(
    routerConfig,
    location,
    shared,
  )

  const [personaModel, personaCmd] = Persona.init()
  const colorScheme = loadColorScheme()
  const savedThemeId = loadThemeId()
  const theme = (savedThemeId ? themes[savedThemeId] : null) ?? defaultTheme

  const model: Model = {
    router: routerModel,
    shared,
    persona: personaModel,
    showScrollTop: false,
    theme,
    colorScheme,
  }

  const initCmd = Cmd.batch([
    routerCmd,
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
  }

  return Task.perform(Task.succeed(undefined), (): Msg => ({
    _tag: 'Init',
    location,
    user: O.none,
    isUnavailable: false,
    token: O.none,
  }))
}

export const routerMsgHandler = (
  subMsg: Extract<Msg, { _tag: 'TeaRouterMsg' }>['subMsg'],
  model: Model,
): [Model, Cmd<Msg>] => {
  const [routerModel, routerCmd] = TeaRouter.update(routerConfig, model.shared)(
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

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'TeaRouterMsg':
      return routerMsgHandler(msg.subMsg, model)
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
  return routerMsgHandler(
    TeaRouter.ChangeRouteMsg({ page: { _tag: 'LoginPage' } }),
    nextModel,
  )
}

const homePageMsgHandler = (
  subMsg: Home.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = TeaRouter.getPageModel(model.router)
  if (pageModel._tag === 'HomePageModel') {
    const [m, c] = Home.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        router: TeaRouter.setPageModel(model.router, {
          _tag: 'HomePageModel',
          model: m,
        }),
      },
      c.map((msg): Msg => ({ _tag: 'HomePageMsg', subMsg: msg })),
    ]
  }
  return [model, Cmd.none()]
}

const loginPageMsgHandler = (
  subMsg: Login.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = TeaRouter.getPageModel(model.router)
  if (pageModel._tag === 'LoginPageModel') {
    const [m, c] = Login.update(subMsg, pageModel.model)
    const nextModel: Model = {
      ...model,
      router: TeaRouter.setPageModel(model.router, {
        _tag: 'LoginPageModel',
        model: m,
      }),
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
      const [finalModel, routerCmd] = routerMsgHandler(
        TeaRouter.ChangeRouteMsg({ page: { _tag: 'HomePage' } }),
        updatedModel,
      )
      return [finalModel, Cmd.batch([nextCmd, routerCmd])]
    }

    return [nextModel, nextCmd]
  }
  return [model, Cmd.none()]
}

const articlesPageMsgHandler = (
  subMsg: Articles.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = TeaRouter.getPageModel(model.router)
  if (pageModel._tag === 'ArticlePageModel') {
    const [m, c] = Articles.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        router: TeaRouter.setPageModel(model.router, {
          _tag: 'ArticlePageModel',
          model: m,
        }),
      },
      c.map((msg): Msg => ({ _tag: 'ArticlePageMsg', subMsg: msg })),
    ]
  }
  return [model, Cmd.none()]
}

const usersPageMsgHandler = (
  subMsg: Users.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = TeaRouter.getPageModel(model.router)
  if (pageModel._tag === 'UserPageModel') {
    const [m, c] = Users.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        router: TeaRouter.setPageModel(model.router, {
          _tag: 'UserPageModel',
          model: m,
        }),
      },
      c.map((msg): Msg => ({ _tag: 'UserPageMsg', subMsg: msg })),
    ]
  }
  return [model, Cmd.none()]
}

const commentsPageMsgHandler = (
  subMsg: Comments.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = TeaRouter.getPageModel(model.router)
  if (pageModel._tag === 'CommentPageModel') {
    const [m, c] = Comments.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        router: TeaRouter.setPageModel(model.router, {
          _tag: 'CommentPageModel',
          model: m,
        }),
      },
      c.map((msg): Msg => ({ _tag: 'CommentPageMsg', subMsg: msg })),
    ]
  }
  return [model, Cmd.none()]
}

const visitorsPageMsgHandler = (
  subMsg: Visitors.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = TeaRouter.getPageModel(model.router)
  if (pageModel._tag === 'VisitorPageModel') {
    const [m, c] = Visitors.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        router: TeaRouter.setPageModel(model.router, {
          _tag: 'VisitorPageModel',
          model: m,
        }),
      },
      c.map((msg): Msg => ({ _tag: 'VisitorPageMsg', subMsg: msg })),
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
