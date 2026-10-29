import { taskFromTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { Cmd, Task } from 'tea-cup-fp'

import { getCurrentUser } from '@/common/api'
import {
  loadToken,
  removeToken,
  removeTokenCmd,
  saveToken,
  saveTokenCmd,
} from '@/common/cache'
import { defaultDestination, loginDestination } from '@/common/type/destination'
import { type Shared } from '@/common/type/shared'
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
import { guardDestination } from '@/util'

import { type Boot, type Model, type Msg, sameScreenWith } from './type'

// Initialization
// ---------------------------------------------

export const preInit = (): [Model | null, Cmd<Msg>] => [null, initializeCmd()]

// Asks the server who the stored token belongs to, and keeps or forgets
// the token from its answer. The app builds its model from it (`init`).
export const initializeCmd = (): Cmd<Msg> => {
  const storedToken = loadToken()
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

      // Inside the task (a Cmd), with the answer it depends on
      if (token._tag === 'Some') saveToken(token.value)
      else removeToken()

      return initMsg({
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
      })
    })
  } else {
    return Task.perform(Task.succeed(undefined), (): Msg =>
      initMsg({ user: O.none, isUnavailable: false, token: O.none }),
    )
  }
}

const initMsg = (boot: Boot): Msg => ({ _tag: 'Init', boot })

// The model the boot opens. A terminal has no URL: the app boots on the
// default destination, through the guard (a signed out admin goes to the
// login screen). The stored token is not touched here: `initializeCmd` already saved or
// removed it from the server's answer, and with no stored token there is
// nothing to remove. Removing it here raced with a token saved between
// page load and this delayed boot (e.g. by a test), and wiped it.
export const init = (boot: Boot): [Model, Cmd<Msg>] => {
  const shared: Shared = {
    user: boot.user,
    token: boot.token,
  }
  const [screenModel, screenCmd] = initScreenModel(
    guardDestination(shared, defaultDestination()),
    shared,
  )
  return [{ screenModel, shared, isTyping: false }, screenCmd]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'Init':
      // Handled before the model exists (`program.tsx`)
      return [model, Cmd.none()]
    case 'SetTyping':
      return [{ ...model, isTyping: msg.isTyping }, Cmd.none()]
    case 'NavigationMsg':
      // A move closes the text field of the screen left
      return navigationMsgHandler(msg.subMsg, { ...model, isTyping: false })
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
    case 'NoOp':
      return [model, Cmd.none()]
  }
}

// Handlers
// ---------------------------------------------

const logoutHandler = (model: Model): [Model, Cmd<Msg>] => {
  const updatedModel: Model = {
    ...model,
    shared: {
      user: O.none,
      token: O.none,
    },
  }
  const [navigatedModel, navigationCmd] = navigationMsgHandler(
    { _tag: 'Navigate', destination: loginDestination() },
    updatedModel,
  )
  return [
    navigatedModel,
    Cmd.batch([removeTokenCmd().map((noOp): Msg => noOp), navigationCmd]),
  ]
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
        screenModel: sameScreenWith(screenModel)({
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
  const screenModel = model.screenModel
  if (screenModel._tag === 'LoginScreenModel') {
    const [m, c] = LoginScreen.update(subMsg, screenModel.model)
    const nextModel: Model = {
      ...model,
      screenModel: sameScreenWith(screenModel)({
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
      return [
        navigatedModel,
        Cmd.batch([
          saveTokenCmd(user.token).map((noOp): Msg => noOp),
          nextCmd,
          navigationCmd,
        ]),
      ]
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
        screenModel: sameScreenWith(screenModel)({
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
  const screenModel = model.screenModel
  if (screenModel._tag === 'UserScreenModel') {
    const [m, c] = UserScreen.update(model.shared)(subMsg, screenModel.model)
    return [
      {
        ...model,
        screenModel: sameScreenWith(screenModel)({
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
  const screenModel = model.screenModel
  if (screenModel._tag === 'CommentScreenModel') {
    const [m, c] = CommentScreen.update(model.shared)(subMsg, screenModel.model)
    return [
      {
        ...model,
        screenModel: sameScreenWith(screenModel)({
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
  const screenModel = model.screenModel
  if (screenModel._tag === 'VisitorScreenModel') {
    const [m, c] = VisitorScreen.update(model.shared)(subMsg, screenModel.model)
    return [
      {
        ...model,
        screenModel: sameScreenWith(screenModel)({
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
