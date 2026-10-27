import * as DsFloatingSidebar from '@rinn7e/realworld-design-system/component/floating-sidebar'
import * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import { msgCmd, taskFromTE, updateAndCmd } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd, Task } from 'tea-cup-fp'

import { type User, type UserWithToken, getCurrentUser } from '@/common/api'
import { getToken, removeToken, saveToken } from '@/common/cache'
import {
  type Destination,
  type HomeTab,
  articleScreen,
  defaultDestination,
  destinationOfScreen,
  loginDestination,
  profileScreen,
} from '@/common/type/destination'
import { replaceUrlCmd } from '@/common/util'
import * as DebugPanel from '@/component/debug-panel'
import {
  initScreenModel,
  navigationMsgHandler,
  trackDestinationChangeHandler,
  trackVisitorCmd,
} from '@/handler/navigation-handler'
import * as ArticleScreen from '@/screen/article-screen'
import * as EditorScreen from '@/screen/editor-screen'
import * as HomeScreen from '@/screen/home-screen'
import * as LoginScreen from '@/screen/login-screen'
import * as ProfileScreen from '@/screen/profile-screen'
import * as SettingsScreen from '@/screen/settings-screen'
import * as SignupScreen from '@/screen/signup-screen'
import type { ColorScheme } from '@/theme/type'
import { loadColorScheme, setColorSchemeCmd } from '@/theme/util'
import { type Model, type Msg, withScreenModel } from '@/type'
import {
  bootDestinationOf,
  bootUrlOf,
  destinationOf,
  guardDestination,
} from '@/util'

import { findNavItemDestination } from './navbar/util'

// Initialization
// ---------------------------------------------

export const preInit = (location: Location): [Model | null, Cmd<Msg>] => {
  return [null, initializeCmd(location)]
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
  const urlDestination = bootDestinationOf(location)
  const destination = guardDestination(shared, urlDestination)
  const [screenModel, screenCmd] = initScreenModel(destination, shared)

  const model: Model = {
    screenModel,
    unavailableMode: isUnavailable,
    shared,
    debugPanel: DebugPanel.init(),
    sidebar: DsFloatingSidebar.init()[0],
    navbar: DsNavbar.init()[0],
    colorScheme: initialColorScheme,
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
    trackVisitorCmd(token, destination),
    setColorSchemeCmd(initialColorScheme).map((): Msg => ({ _tag: 'NoOp' })),
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

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'NoOp':
      return [model, Cmd.none()]
    case 'Init':
      return [model, Cmd.none()]
    case 'NavigationMsg':
      return navigationMsgHandler(msg.subMsg, model)

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
    case 'HomeScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag === 'HomeScreenModel') {
        const prevDestination = destinationOf(model)
        const [homeModel, homeCmd] = HomeScreen.update(model.shared)(
          msg.subMsg,
          screenModel.model,
        )
        return pipe(
          [
            withScreenModel(model, {
              _tag: 'HomeScreenModel',
              model: homeModel,
            }),
            homeCmd.map((subMsg): Msg => ({
              _tag: 'HomeScreenMsg',
              subMsg,
            })),
          ] satisfies [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (msg.subMsg._tag === 'ChangeTab') {
              return interceptChangeTabFromHomeScreen(
                msg.subMsg.tab,
                prevDestination,
              )(m)
            } else if (
              msg.subMsg._tag === 'PaginationMsg' &&
              msg.subMsg.subMsg._tag === 'ChangePage'
            ) {
              // The page is part of the destination: the URL follows it
              // after the step, and its change records a visit
              return trackDestinationChangeHandler(prevDestination)(m)
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'ArticleScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag === 'ArticleScreenModel') {
        const [articleModel, articleCmd] = ArticleScreen.update(model.shared)(
          msg.subMsg,
          screenModel.model,
        )
        return pipe(
          [
            withScreenModel(model, {
              _tag: 'ArticleScreenModel',
              model: articleModel,
            }),
            articleCmd.map((m): Msg => ({
              _tag: 'ArticleScreenMsg',
              subMsg: m,
            })),
          ] satisfies [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.subMsg._tag === 'DeleteArticleResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              return navigationMsgHandler(
                { _tag: 'Navigate', destination: defaultDestination() },
                m,
              )
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'LoginScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag === 'LoginScreenModel') {
        const [loginModel, loginCmd] = LoginScreen.update(model.shared)(
          msg.subMsg,
          screenModel.model,
        )

        return pipe(
          [
            withScreenModel(model, {
              _tag: 'LoginScreenModel',
              model: loginModel,
            }),
            loginCmd.map((m): Msg => ({ _tag: 'LoginScreenMsg', subMsg: m })),
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
              return navigationMsgHandler(
                { _tag: 'Navigate', destination: defaultDestination() },
                nextModel,
              )
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'SignupScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag === 'SignupScreenModel') {
        const [signupModel, signupCmd] = SignupScreen.update(model.shared)(
          msg.subMsg,
          screenModel.model,
        )

        return pipe(
          [
            withScreenModel(model, {
              _tag: 'SignupScreenModel',
              model: signupModel,
            }),
            signupCmd.map((m): Msg => ({ _tag: 'SignupScreenMsg', subMsg: m })),
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
              return navigationMsgHandler(
                { _tag: 'Navigate', destination: defaultDestination() },
                nextModel,
              )
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'SettingsScreenMsg': {
      const { screenModel } = model
      if (
        screenModel._tag === 'SettingsScreenModel' &&
        model.shared.user._tag === 'Some'
      ) {
        const [settingsModel, settingsCmd] = SettingsScreen.update(
          model.shared,
        )(msg.subMsg, screenModel.model)

        return pipe(
          [
            withScreenModel(model, {
              _tag: 'SettingsScreenModel',
              model: settingsModel,
            }),
            settingsCmd.map((m): Msg => ({
              _tag: 'SettingsScreenMsg',
              subMsg: m,
            })),
          ] satisfies [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (msg.subMsg._tag === 'Logout') {
              return interceptLogoutFromSettingsScreen(m)
            } else if (
              msg.subMsg._tag === 'SubmitResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              return interceptSubmitResponseOkFromSettingsScreen(
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
    case 'ProfileScreenMsg': {
      const { screenModel } = model
      if (screenModel._tag === 'ProfileScreenModel') {
        const prevDestination = destinationOf(model)
        const [profileModel, profileCmd] = ProfileScreen.update(model.shared)(
          msg.subMsg,
          screenModel.model,
        )

        return pipe(
          [
            withScreenModel(model, {
              _tag: 'ProfileScreenModel',
              model: profileModel,
            }),
            profileCmd.map((m): Msg => ({
              _tag: 'ProfileScreenMsg',
              subMsg: m,
            })),
          ] satisfies [Model, Cmd<Msg>],
          // The favorites tab is part of the destination: the URL follows
          // it after the step, and its change records a visit
          updateAndCmd(trackDestinationChangeHandler(prevDestination)),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'EditorScreenMsg': {
      const { screenModel } = model
      if (
        screenModel._tag === 'EditorScreenModel' &&
        model.shared.user._tag === 'Some'
      ) {
        const [editorModel, editorCmd] = EditorScreen.update(model.shared)(
          msg.subMsg,
          screenModel.model,
        )

        return pipe(
          [
            withScreenModel(model, {
              _tag: 'EditorScreenModel',
              model: editorModel,
            }),
            editorCmd.map((m): Msg => ({ _tag: 'EditorScreenMsg', subMsg: m })),
          ] satisfies [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.subMsg._tag === 'SubmitResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              const slug = msg.subMsg.result.value.article.slug
              return navigationMsgHandler(
                {
                  _tag: 'Navigate',
                  destination: destinationOfScreen(articleScreen(slug)),
                },
                m,
              )
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
          const targetDestination = findNavItemDestination(m, item.key)
          if (targetDestination) {
            return navigationMsgHandler(
              { _tag: 'Navigate', destination: targetDestination },
              m,
            )
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
          const targetDestination = findNavItemDestination(m, item.key)
          if (targetDestination) {
            return navigationMsgHandler(
              { _tag: 'Navigate', destination: targetDestination },
              m,
            )
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

const interceptLogoutFromSettingsScreen = (m: Model): [Model, Cmd<Msg>] => {
  removeToken()
  const nextModel: Model = {
    ...m,
    shared: { ...m.shared, user: O.none, token: O.none },
  }
  return navigationMsgHandler(
    { _tag: 'Navigate', destination: defaultDestination() },
    nextModel,
  )
}

const interceptSubmitResponseOkFromSettingsScreen =
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
    return navigationMsgHandler(
      {
        _tag: 'Navigate',
        destination: destinationOfScreen(profileScreen(user.username, false)),
      },
      nextModel,
    )
  }

// The tab is part of the destination: the URL follows it after the step,
// and its change records a visit. The user feed of a signed-out visitor
// sends to login instead.
const interceptChangeTabFromHomeScreen =
  (tab: HomeTab, prevDestination: Destination) =>
  (m: Model): [Model, Cmd<Msg>] => {
    if (tab._tag === 'UserFeedTab' && m.shared.user._tag === 'None') {
      return navigationMsgHandler(
        { _tag: 'Navigate', destination: loginDestination() },
        m,
      )
    } else {
      return trackDestinationChangeHandler(prevDestination)(m)
    }
  }
