import { taskFromTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd, Task } from 'tea-cup-fp'

import { getCurrentUser } from '@/common/api'
import { getToken, removeToken, saveToken } from '@/common/cache'
import { type AuthUser } from '@/common/type/auth-user'
import { defaultDestination, loginDestination } from '@/common/type/destination'
import { type Shared } from '@/common/type/shared'
import { replaceUrlCmd } from '@/common/util'
import * as Persona from '@/component/persona-panel'
import {
  initScreenModel,
  navigationMsgHandler,
} from '@/handler/navigation-handler'
import * as ArticleScreen from '@/screen/article-screen'
import * as CommentScreen from '@/screen/comment-screen'
import * as HomeScreen from '@/screen/home-screen'
import * as LoginScreen from '@/screen/login-screen'
import * as UserScreen from '@/screen/user-screen'
import * as VisitorScreen from '@/screen/visitor-screen'
import { bootDestinationOf, bootUrlOf, guardDestination } from '@/util'

import { defaultTheme, themes } from './theme/data'
import { type ColorScheme, type Theme } from './theme/type'
import {
  injectTheme,
  loadColorScheme,
  loadThemeId,
  saveColorScheme,
  saveTheme,
} from './theme/util'
import { type Model, type Msg } from './type'

// Initialization
// ---------------------------------------------

export const preInit = (location: Location): [Model | null, Cmd<Msg>] => {
  return [null, initializeCmd(location)]
}

export const init = (
  location: Location,
  user: O.Option<AuthUser>,
  isUnavailable: boolean,
  token: O.Option<string>,
): [Model, Cmd<Msg>] => {
  // The stored token is not touched here: `initializeCmd` already saved or
  // removed it from the server's answer, and with no stored token there is
  // nothing to remove. Removing it here raced with a token saved between
  // page load and this delayed `Init` (e.g. by a test), and wiped it.
  const shared: Shared = {
    user,
    token,
  }

  const urlDestination = bootDestinationOf(location)
  const destination = guardDestination(shared, urlDestination)
  const [screenModel, screenCmd] = initScreenModel(destination, shared)

  const [personaModel, personaCmd] = Persona.init()
  const colorScheme = loadColorScheme()
  const savedThemeId = loadThemeId()
  const theme = (savedThemeId ? themes[savedThemeId] : null) ?? defaultTheme

  const model: Model = {
    screenModel,
    shared,
    persona: personaModel,
    showScrollTop: false,
    theme,
    colorScheme,
  }

  const initCmd = Cmd.batch([
    pipe(
      bootUrlOf(urlDestination, destination),
      O.fold(
        () => Cmd.none<Msg>(),
        (url) => replaceUrlCmd(url).map((noOp): Msg => noOp),
      ),
    ),
    screenCmd,
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

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'NavigationMsg':
      return navigationMsgHandler(msg.subMsg, model)
    case 'Init':
      // Handled before the model exists (`program.tsx`)
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
  const updatedModel: Model = {
    ...model,
    shared: {
      user: O.none,
      token: O.none,
    },
  }
  return navigationMsgHandler(
    { _tag: 'Navigate', destination: loginDestination() },
    updatedModel,
  )
}

const homeScreenMsgHandler = (
  subMsg: HomeScreen.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const screenModel = model.screenModel
  if (screenModel._tag === 'HomeScreenModel') {
    const [m, c] = HomeScreen.update(model.shared)(subMsg, screenModel.model)
    return [
      {
        ...model,
        screenModel: { _tag: 'HomeScreenModel', model: m },
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
  const screenModel = model.screenModel
  if (screenModel._tag === 'LoginScreenModel') {
    const [m, c] = LoginScreen.update(subMsg, screenModel.model)
    const nextModel: Model = {
      ...model,
      screenModel: { _tag: 'LoginScreenModel', model: m },
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
      const [navigatedModel, navigationCmd] = navigationMsgHandler(
        { _tag: 'Navigate', destination: defaultDestination() },
        updatedModel,
      )
      return [navigatedModel, Cmd.batch([nextCmd, navigationCmd])]
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
  const screenModel = model.screenModel
  if (screenModel._tag === 'ArticleScreenModel') {
    const [m, c] = ArticleScreen.update(model.shared)(subMsg, screenModel.model)
    return [
      {
        ...model,
        screenModel: { _tag: 'ArticleScreenModel', model: m },
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
  const screenModel = model.screenModel
  if (screenModel._tag === 'UserScreenModel') {
    const [m, c] = UserScreen.update(model.shared)(subMsg, screenModel.model)
    return [
      {
        ...model,
        screenModel: { _tag: 'UserScreenModel', model: m },
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
  const screenModel = model.screenModel
  if (screenModel._tag === 'CommentScreenModel') {
    const [m, c] = CommentScreen.update(model.shared)(subMsg, screenModel.model)
    return [
      {
        ...model,
        screenModel: { _tag: 'CommentScreenModel', model: m },
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
  const screenModel = model.screenModel
  if (screenModel._tag === 'VisitorScreenModel') {
    const [m, c] = VisitorScreen.update(model.shared)(subMsg, screenModel.model)
    return [
      {
        ...model,
        screenModel: { _tag: 'VisitorScreenModel', model: m },
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
