import { taskFromTE } from '@rinn7e/tea-cup-prelude'
import * as TeaRouter from '@rinn7e/tea-cup-router'
import * as O from 'fp-ts/lib/Option'
import { Cmd, Task } from 'tea-cup-fp'

import { getCurrentUser } from '@/common/api'
import { getToken, removeToken, saveToken } from '@/common/cache'
import { type AuthUser } from '@/common/type/auth-user'
import { type AppRoute } from '@/common/type/route'
import { type Shared } from '@/common/type/shared'
import * as Persona from '@/component/persona-panel'
import { mkRouterConfig } from '@/router-config'
import * as ArticleScreen from '@/screen/article-screen'
import * as CommentScreen from '@/screen/comment-screen'
import * as HomeScreen from '@/screen/home-screen'
import * as LoginScreen from '@/screen/login-screen'
import * as UserScreen from '@/screen/user-screen'
import * as VisitorScreen from '@/screen/visitor-screen'

import { defaultTheme, themes } from './theme/data'
import { type ColorScheme, type Theme } from './theme/type'
import {
  injectTheme,
  loadColorScheme,
  loadThemeId,
  saveColorScheme,
  saveTheme,
} from './theme/util'
import { type Model, type Msg, type ScreenModel, teaRouterMsg } from './type'

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

export const initScreenModel = (
  route: AppRoute,
  shared: Shared,
): [ScreenModel, Cmd<Msg>] => {
  switch (route.page._tag) {
    case 'PageHome': {
      const [m, c] = HomeScreen.init(shared)
      return [
        { _tag: 'HomeScreenModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'HomeScreenMsg', subMsg })),
      ]
    }
    case 'PageLogin': {
      const [m, c] = LoginScreen.init()
      return [
        { _tag: 'LoginScreenModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'LoginScreenMsg', subMsg })),
      ]
    }
    case 'PageArticle': {
      const [m, c] = ArticleScreen.init(shared)
      return [
        { _tag: 'ArticleScreenModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'ArticleScreenMsg', subMsg })),
      ]
    }
    case 'PageUser': {
      const [m, c] = UserScreen.init(shared)
      return [
        { _tag: 'UserScreenModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'UserScreenMsg', subMsg })),
      ]
    }
    case 'PageComment': {
      const [m, c] = CommentScreen.init(shared)
      return [
        { _tag: 'CommentScreenModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'CommentScreenMsg', subMsg })),
      ]
    }
    case 'PageVisitor': {
      const [m, c] = VisitorScreen.init(shared)
      return [
        { _tag: 'VisitorScreenModel', model: m },
        c.map((subMsg): Msg => ({ _tag: 'VisitorScreenMsg', subMsg })),
      ]
    }
    case 'PageSetting':
      return [{ _tag: 'SettingScreenModel' }, Cmd.none()]
    case 'PageNotFound':
      return [{ _tag: 'NotFoundScreenModel' }, Cmd.none()]
  }
}

export const routerConfig = mkRouterConfig<ScreenModel, Msg>(
  initScreenModel,
  teaRouterMsg,
)

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
    case 'HomeScreenMsg':
      return homeScreenMsgHandler(msg.subMsg, model)
    case 'LoginScreenMsg':
      return loginScreenMsgHandler(msg.subMsg, model)
    case 'ArticleScreenMsg':
      return articlesScreenMsgHandler(msg.subMsg, model)
    case 'UserScreenMsg':
      return usersScreenMsgHandler(msg.subMsg, model)
    case 'CommentScreenMsg':
      return commentsScreenMsgHandler(msg.subMsg, model)
    case 'VisitorScreenMsg':
      return visitorsScreenMsgHandler(msg.subMsg, model)
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
    { _tag: 'ChangeRoute', route: { page: { _tag: 'PageLogin' } } },
    nextModel,
  )
}

const homeScreenMsgHandler = (
  subMsg: HomeScreen.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = TeaRouter.getPageModel(model.router)
  if (pageModel._tag === 'HomeScreenModel') {
    const [m, c] = HomeScreen.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        router: TeaRouter.setPageModel(model.router, {
          _tag: 'HomeScreenModel',
          model: m,
        }),
      },
      c.map((msg): Msg => ({ _tag: 'HomeScreenMsg', subMsg: msg })),
    ]
  } else {
    return [model, Cmd.none()]
  }
}

const loginScreenMsgHandler = (
  subMsg: LoginScreen.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = TeaRouter.getPageModel(model.router)
  if (pageModel._tag === 'LoginScreenModel') {
    const [m, c] = LoginScreen.update(subMsg, pageModel.model)
    const nextModel: Model = {
      ...model,
      router: TeaRouter.setPageModel(model.router, {
        _tag: 'LoginScreenModel',
        model: m,
      }),
    }
    const nextCmd = c.map((msg): Msg => ({
      _tag: 'LoginScreenMsg',
      subMsg: msg,
    }))

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
        { _tag: 'ChangeRoute', route: { page: { _tag: 'PageHome' } } },
        updatedModel,
      )
      return [finalModel, Cmd.batch([nextCmd, routerCmd])]
    } else {
      return [nextModel, nextCmd]
    }
  } else {
    return [model, Cmd.none()]
  }
}

const articlesScreenMsgHandler = (
  subMsg: ArticleScreen.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = TeaRouter.getPageModel(model.router)
  if (pageModel._tag === 'ArticleScreenModel') {
    const [m, c] = ArticleScreen.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        router: TeaRouter.setPageModel(model.router, {
          _tag: 'ArticleScreenModel',
          model: m,
        }),
      },
      c.map((msg): Msg => ({ _tag: 'ArticleScreenMsg', subMsg: msg })),
    ]
  } else {
    return [model, Cmd.none()]
  }
}

const usersScreenMsgHandler = (
  subMsg: UserScreen.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = TeaRouter.getPageModel(model.router)
  if (pageModel._tag === 'UserScreenModel') {
    const [m, c] = UserScreen.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        router: TeaRouter.setPageModel(model.router, {
          _tag: 'UserScreenModel',
          model: m,
        }),
      },
      c.map((msg): Msg => ({ _tag: 'UserScreenMsg', subMsg: msg })),
    ]
  } else {
    return [model, Cmd.none()]
  }
}

const commentsScreenMsgHandler = (
  subMsg: CommentScreen.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = TeaRouter.getPageModel(model.router)
  if (pageModel._tag === 'CommentScreenModel') {
    const [m, c] = CommentScreen.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        router: TeaRouter.setPageModel(model.router, {
          _tag: 'CommentScreenModel',
          model: m,
        }),
      },
      c.map((msg): Msg => ({ _tag: 'CommentScreenMsg', subMsg: msg })),
    ]
  } else {
    return [model, Cmd.none()]
  }
}

const visitorsScreenMsgHandler = (
  subMsg: VisitorScreen.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const pageModel = TeaRouter.getPageModel(model.router)
  if (pageModel._tag === 'VisitorScreenModel') {
    const [m, c] = VisitorScreen.update(model.shared)(subMsg, pageModel.model)
    return [
      {
        ...model,
        router: TeaRouter.setPageModel(model.router, {
          _tag: 'VisitorScreenModel',
          model: m,
        }),
      },
      c.map((msg): Msg => ({ _tag: 'VisitorScreenMsg', subMsg: msg })),
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
