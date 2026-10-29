import { taskFromTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { Cmd, Task } from 'tea-cup-fp'

import { getCurrentUser } from '@core/common/api'
import { loadToken, removeTokenCmd, saveTokenCmd } from '@core/common/cache'
import {
  type Destination,
  defaultDestination,
  loginDestination,
} from '@core/common/type/destination'
import { type Shared } from '@core/common/type/shared'
import {
  initScreenModel,
  navigationMsgHandler,
} from '@core/handler/navigation-handler'
import { platform } from '@core/platform'
import * as ArticleScreen from '@core/screen/article-screen'
import * as CommentScreen from '@core/screen/comment-screen'
import * as HomeScreen from '@core/screen/home-screen'
import * as LoginScreen from '@core/screen/login-screen'
import * as UserScreen from '@core/screen/user-screen'
import * as VisitorScreen from '@core/screen/visitor-screen'
import { guardDestination } from '@core/util'

import { type Boot, type Model, type Msg, sameScreenWith } from './type'

// Initialization
// ---------------------------------------------

// Asks the server who the stored token belongs to, and keeps or forgets
// the token from its answer. `toMsg` is the app's message for the result:
// the app builds its model from it (`init`).
export const initializeCmd = <A>(toMsg: (boot: Boot) => A): Cmd<A> => {
  const storedToken = loadToken()
  if (storedToken) {
    return Task.attempt(taskFromTE(getCurrentUser(storedToken)), (res): A => {
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
      if (token._tag === 'Some') platform().saveToken(token.value)
      else platform().removeToken()

      return toMsg({
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
    return Task.perform(Task.succeed(undefined), (): A =>
      toMsg({ user: O.none, isUnavailable: false, token: O.none }),
    )
  }
}

// The shared model the boot opens on `destination` (the app's own: the
// page's URL for the web, the default for the CLI), through the guard.
// The stored token is not touched here: `initializeCmd` already saved or
// removed it from the server's answer, and with no stored token there is
// nothing to remove. Removing it here raced with a token saved between
// page load and this delayed boot (e.g. by a test), and wiped it.
export const init = (
  boot: Boot,
  destination: Destination,
): [Model, Cmd<Msg>] => {
  const shared: Shared = {
    user: boot.user,
    token: boot.token,
  }
  const [screenModel, screenCmd] = initScreenModel(
    guardDestination(shared, destination),
    shared,
  )
  return [{ screenModel, shared }, screenCmd]
}

// Every message the apps share. Generic over the app model: an app's own
// fields come back as they went in.
export const update = <M extends Model>(msg: Msg, model: M): [M, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'NavigationMsg':
      return navigationMsgHandler(msg.subMsg, model)
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

const logoutHandler = <M extends Model>(model: M): [M, Cmd<Msg>] => {
  const updatedModel: M = {
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

const homeScreenMsgHandler = <M extends Model>(
  subMsg: HomeScreen.Msg,
  model: M,
): [M, Cmd<Msg>] => {
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

const loginScreenMsgHandler = <M extends Model>(
  subMsg: LoginScreen.Msg,
  model: M,
): [M, Cmd<Msg>] => {
  const screenModel = model.screenModel
  if (screenModel._tag === 'LoginScreenModel') {
    const [m, c] = LoginScreen.update(subMsg, screenModel.model)
    const nextModel: M = {
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
      const updatedModel: M = {
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

const articlesScreenMsgHandler = <M extends Model>(
  subMsg: ArticleScreen.Msg,
  model: M,
): [M, Cmd<Msg>] => {
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

const usersScreenMsgHandler = <M extends Model>(
  subMsg: UserScreen.Msg,
  model: M,
): [M, Cmd<Msg>] => {
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

const commentsScreenMsgHandler = <M extends Model>(
  subMsg: CommentScreen.Msg,
  model: M,
): [M, Cmd<Msg>] => {
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

const visitorsScreenMsgHandler = <M extends Model>(
  subMsg: VisitorScreen.Msg,
  model: M,
): [M, Cmd<Msg>] => {
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
