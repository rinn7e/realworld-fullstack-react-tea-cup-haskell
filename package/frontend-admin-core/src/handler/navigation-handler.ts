import { Cmd } from 'tea-cup-fp'

import {
  type Destination,
  type DestinationAfterGuard,
  DestinationEq,
  type NavigationMsg,
} from '@core/common/type/destination'
import { type Shared } from '@core/common/type/shared'
import * as ArticleScreen from '@core/screen/article-screen'
import * as CommentScreen from '@core/screen/comment-screen'
import * as HomeScreen from '@core/screen/home-screen'
import * as LoginScreen from '@core/screen/login-screen'
import * as UserScreen from '@core/screen/user-screen'
import * as VisitorScreen from '@core/screen/visitor-screen'
import {
  type CurrentScreenModel,
  type Model,
  type Msg,
  type ScreenModel,
  currentScreenModelOfMove,
  withScreenModel,
} from '@core/type'
import { destinationOf, guardDestination } from '@core/util'

// The screen model of `destination`, the one place a move opens a screen.
// Every move opens its screen afresh: no admin screen keeps state across a
// move. Review: called only by `navigateHandler` and the boot, after the
// guard.
export const initScreenModel = (
  destination: DestinationAfterGuard,
  shared: Shared,
): [CurrentScreenModel, Cmd<Msg>] => {
  const [screenModel, cmd] = freshScreenModelOf(destination, shared)
  return [currentScreenModelOfMove(destination)(screenModel), cmd]
}

const freshScreenModelOf = (
  destination: Destination,
  shared: Shared,
): [ScreenModel, Cmd<Msg>] => {
  switch (destination.screen._tag) {
    case 'HomeScreen': {
      const [newModel, cmd] = HomeScreen.init(shared)
      return [
        { _tag: 'HomeScreenModel', model: newModel },
        cmd.map((subMsg): Msg => ({ _tag: 'HomeScreenMsg', subMsg })),
      ]
    }
    case 'LoginScreen': {
      const [newModel, cmd] = LoginScreen.init()
      return [
        { _tag: 'LoginScreenModel', model: newModel },
        cmd.map((subMsg): Msg => ({ _tag: 'LoginScreenMsg', subMsg })),
      ]
    }
    case 'ArticleScreen': {
      const [newModel, cmd] = ArticleScreen.init(shared)
      return [
        { _tag: 'ArticleScreenModel', model: newModel },
        cmd.map((subMsg): Msg => ({ _tag: 'ArticleScreenMsg', subMsg })),
      ]
    }
    case 'UserScreen': {
      const [newModel, cmd] = UserScreen.init(shared)
      return [
        { _tag: 'UserScreenModel', model: newModel },
        cmd.map((subMsg): Msg => ({ _tag: 'UserScreenMsg', subMsg })),
      ]
    }
    case 'CommentScreen': {
      const [newModel, cmd] = CommentScreen.init(shared)
      return [
        { _tag: 'CommentScreenModel', model: newModel },
        cmd.map((subMsg): Msg => ({ _tag: 'CommentScreenMsg', subMsg })),
      ]
    }
    case 'VisitorScreen': {
      const [newModel, cmd] = VisitorScreen.init(shared)
      return [
        { _tag: 'VisitorScreenModel', model: newModel },
        cmd.map((subMsg): Msg => ({ _tag: 'VisitorScreenMsg', subMsg })),
      ]
    }
    case 'SettingScreen':
      return [{ _tag: 'SettingScreenModel' }, Cmd.none()]
    case 'NotFoundScreen':
      return [{ _tag: 'NotFoundScreenModel' }, Cmd.none()]
  }
}

// Opens `destination` once the guard has passed it (or the destination it
// redirects to). A move to the destination shown is dropped when it comes
// from the URL (`isInternal` false), unless redirected or refreshed; the
// app's own moves always open it again (a click on the screen shown
// refreshes it).
export const navigateHandler =
  (destination: Destination, isInternal: boolean, forceRefresh: boolean) =>
  <M extends Model>(model: M): [M, Cmd<Msg>] => {
    const guarded = guardDestination(model.shared, destination)
    const isRedirected = !DestinationEq.equals(destination, guarded)
    if (
      !isInternal &&
      !isRedirected &&
      !forceRefresh &&
      DestinationEq.equals(destinationOf(model), guarded)
    ) {
      return [model, Cmd.none()]
    } else {
      const [screenModel, screenCmd] = initScreenModel(guarded, model.shared)
      return [withScreenModel(model, screenModel), screenCmd]
    }
  }

// The destination a `NavigationMsg` moves to
const targetDestinationOf = (
  subMsg: NavigationMsg,
  currentDestination: Destination,
): Destination => {
  switch (subMsg._tag) {
    case 'Navigate':
      return subMsg.destination
    case 'ModifyDestination':
      return subMsg.func(currentDestination)
    case 'Refresh':
      return currentDestination
    case 'UrlChanged':
      return subMsg.destination
  }
}

// Every move of the app. The URL follows the destination after the step
// (`withUrl`), so nothing here writes it.
export const navigationMsgHandler = <M extends Model>(
  subMsg: NavigationMsg,
  model: M,
): [M, Cmd<Msg>] =>
  navigateHandler(
    targetDestinationOf(subMsg, destinationOf(model)),
    subMsg._tag !== 'UrlChanged',
    subMsg._tag === 'Refresh' ||
      ((subMsg._tag === 'Navigate' || subMsg._tag === 'ModifyDestination') &&
        subMsg.forceRefresh === true),
  )(model)
