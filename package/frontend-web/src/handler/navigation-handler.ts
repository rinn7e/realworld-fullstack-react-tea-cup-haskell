import * as DsFloatingSidebar from '@rinn7e/realworld-design-system/component/floating-sidebar'
import { taskFromTE } from '@rinn7e/tea-cup-prelude'
import type * as O from 'fp-ts/lib/Option'
import { Cmd, Task } from 'tea-cup-fp'

import { trackVisitor } from '@/common/api'
import {
  type Destination,
  type DestinationAfterGuard,
  DestinationEq,
  type NavigationMsg,
  toUrlString,
} from '@/common/type/destination'
import { type Shared } from '@/common/type/shared'
import * as ArticleScreen from '@/screen/article-screen'
import * as EditorScreen from '@/screen/editor-screen'
import * as HomeScreen from '@/screen/home-screen'
import * as LoginScreen from '@/screen/login-screen'
import * as ProfileScreen from '@/screen/profile-screen'
import * as SettingsScreen from '@/screen/settings-screen'
import * as SignupScreen from '@/screen/signup-screen'
import {
  type CurrentScreenModel,
  type Model,
  type Msg,
  type ScreenModel,
  currentScreenModelOfMove,
  withScreenModel,
} from '@/type'
import { destinationOf, guardDestination } from '@/util'

// The screen model of `destination`, the one place a move opens a screen.
// Every move opens its screen afresh, with the params of the destination.
// Review: called only by `navigateHandler` and the boot, after the guard.
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
  const { screen } = destination
  switch (screen._tag) {
    case 'HomeScreen': {
      const [model, cmd] = HomeScreen.init(screen.tab, screen.page, shared)
      return [
        { _tag: 'HomeScreenModel', model },
        cmd.map((m): Msg => ({ _tag: 'HomeScreenMsg', subMsg: m })),
      ]
    }
    case 'ArticleScreen': {
      const [model, cmd] = ArticleScreen.init(screen.slug, shared)
      return [
        { _tag: 'ArticleScreenModel', model },
        cmd.map((m): Msg => ({ _tag: 'ArticleScreenMsg', subMsg: m })),
      ]
    }
    case 'LoginScreen': {
      const [model, cmd] = LoginScreen.init(shared)
      return [
        { _tag: 'LoginScreenModel', model },
        cmd.map((m): Msg => ({ _tag: 'LoginScreenMsg', subMsg: m })),
      ]
    }
    case 'SignupScreen': {
      const [model, cmd] = SignupScreen.init(shared)
      return [
        { _tag: 'SignupScreenModel', model },
        cmd.map((m): Msg => ({ _tag: 'SignupScreenMsg', subMsg: m })),
      ]
    }
    case 'SettingsScreen': {
      if (shared.user._tag === 'None') {
        return [{ _tag: 'NotFoundScreenModel' }, Cmd.none()]
      } else {
        const [model, cmd] = SettingsScreen.init(shared.user.value)
        return [
          { _tag: 'SettingsScreenModel', model },
          cmd.map((m): Msg => ({ _tag: 'SettingsScreenMsg', subMsg: m })),
        ]
      }
    }
    case 'ProfileScreen': {
      const [model, cmd] = ProfileScreen.init(
        screen.username,
        screen.favorites,
        shared,
      )
      return [
        { _tag: 'ProfileScreenModel', model },
        cmd.map((m): Msg => ({ _tag: 'ProfileScreenMsg', subMsg: m })),
      ]
    }
    case 'EditorScreen': {
      if (shared.user._tag === 'None') {
        return [{ _tag: 'NotFoundScreenModel' }, Cmd.none()]
      } else {
        const [model, cmd] = EditorScreen.init(shared, screen.slug)
        return [
          { _tag: 'EditorScreenModel', model },
          cmd.map((m): Msg => ({ _tag: 'EditorScreenMsg', subMsg: m })),
        ]
      }
    }
    default:
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
  (model: Model): [Model, Cmd<Msg>] => {
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

// Records a visit when the destination changed from `prevDestination`: a
// move, or a screen param changed in place (the home tab and page, the
// profile favorites)
export const trackDestinationChangeHandler =
  (prevDestination: Destination) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const destination = destinationOf(model)
    if (DestinationEq.equals(prevDestination, destination)) {
      return [model, Cmd.none()]
    } else {
      return [model, trackVisitorCmd(model.shared.token, destination)]
    }
  }

// Every move of the app. The URL follows the destination after the step
// (`withUrl`), so nothing here writes it. Every move also closes the
// mobile menu, and a move to another destination records a visit.
export const navigationMsgHandler = (
  subMsg: NavigationMsg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const prevDestination = destinationOf(model)
  const [navigatedModel, navigationCmd] = navigateHandler(
    targetDestinationOf(subMsg, prevDestination),
    subMsg._tag !== 'UrlChanged',
    subMsg._tag === 'Refresh' ||
      ((subMsg._tag === 'Navigate' || subMsg._tag === 'ModifyDestination') &&
        subMsg.forceRefresh === true),
  )(model)
  const updatedModel: Model = {
    ...navigatedModel,
    sidebar: DsFloatingSidebar.init()[0],
  }
  const [trackedModel, trackCmd] =
    trackDestinationChangeHandler(prevDestination)(updatedModel)
  return [trackedModel, Cmd.batch([navigationCmd, trackCmd])]
}

export const trackVisitorCmd = (
  token: O.Option<string>,
  destination: Destination,
): Cmd<Msg> => {
  const path = toUrlString(destination)
  return Task.attempt(taskFromTE(trackVisitor(token, { path })), (): Msg => ({
    _tag: 'NoOp',
  }))
}
