import { FloatingSidebarMemo as DsFloatingFloatingSidebarMemo } from '@rinn7e/realworld-design-system/component/floating-sidebar/component'
import { NavbarMemo as DsNavbarMemo } from '@rinn7e/realworld-design-system/component/navbar/component'
import { cn } from '@rinn7e/tea-cup-prelude'
import { type Dispatcher } from 'tea-cup-fp'

import { SetGlobalMsgContext } from './common/global-context'
import { DebugPanelMemo } from './component/debug-panel/component'
import { FooterMemo } from './component/footer'
import { toDesktopNavItems, toNavbarConfig } from './navbar/util'
import { ArticleScreenMemo } from './screen/article-screen/component'
import { EditorScreenMemo } from './screen/editor-screen/component'
import { HomeScreenMemo } from './screen/home-screen/component'
import { LoginScreenMemo } from './screen/login-screen/component'
import { NotFoundScreenMemo } from './screen/not-found-screen/component'
import { ProfileScreenMemo } from './screen/profile-screen/component'
import { SettingsScreenMemo } from './screen/settings-screen/component'
import { SignupScreenMemo } from './screen/signup-screen/component'
import type { Model, Msg } from './type'

export type AppProps = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const App = ({ model, dispatch }: AppProps) => {
  const isNavOpen = model.sidebar.status.state._tag !== 'Invisible'
  const desktopNavItems = toDesktopNavItems(model)
  const navbarConfig = toNavbarConfig(model)

  return (
    <SetGlobalMsgContext value={dispatch}>
      <div
        className={cn(
          'flex min-h-dvh flex-col bg-white text-gray-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100',
          isNavOpen && 'h-dvh overflow-hidden',
        )}
      >
        <DsNavbarMemo
          dataTest='navbar'
          model={model.navbar}
          config={navbarConfig}
          dispatch={(subMsg) => dispatch({ _tag: 'NavbarMsg', subMsg })}
        />
        <main className='flex-grow'>
          <ScreenView model={model} dispatch={dispatch} />
        </main>
        <FooterMemo />
      </div>
      <DsFloatingFloatingSidebarMemo
        model={model.sidebar}
        items={desktopNavItems.map((n) => n.data)}
        dispatch={(subMsg) => dispatch({ _tag: 'SidebarMsg', subMsg })}
      />
      <DebugPanelMemo
        model={model.debugPanel}
        dispatch={(msg) => dispatch({ _tag: 'DebugPanelMsg', subMsg: msg })}
      />
    </SetGlobalMsgContext>
  )
}

const ScreenView = ({ model, dispatch }: AppProps) => {
  const { screenModel } = model

  switch (screenModel._tag) {
    case 'HomeScreenModel':
      return (
        <HomeScreenMemo
          model={screenModel.model}
          shared={model.shared}
          dispatch={(msg) => dispatch({ _tag: 'HomeScreenMsg', subMsg: msg })}
        />
      )
    case 'ArticleScreenModel':
      return (
        <ArticleScreenMemo
          model={screenModel.model}
          user={model.shared.user}
          dispatch={(msg) =>
            dispatch({ _tag: 'ArticleScreenMsg', subMsg: msg })
          }
        />
      )
    case 'LoginScreenModel':
      return (
        <LoginScreenMemo
          model={screenModel.model}
          dispatch={(msg) => dispatch({ _tag: 'LoginScreenMsg', subMsg: msg })}
        />
      )
    case 'SignupScreenModel':
      return (
        <SignupScreenMemo
          model={screenModel.model}
          dispatch={(msg) => dispatch({ _tag: 'SignupScreenMsg', subMsg: msg })}
        />
      )
    case 'SettingsScreenModel':
      return (
        <SettingsScreenMemo
          model={screenModel.model}
          dispatch={(msg) =>
            dispatch({ _tag: 'SettingsScreenMsg', subMsg: msg })
          }
        />
      )
    case 'ProfileScreenModel': {
      const isCurrentUser =
        model.shared.user._tag === 'Some' &&
        model.shared.user.value.username ===
          (screenModel.model.profile._tag === 'RemoteSuccess'
            ? screenModel.model.profile.value.profile.username
            : '')

      return (
        <ProfileScreenMemo
          model={screenModel.model}
          shared={model.shared}
          dispatch={(msg) =>
            dispatch({ _tag: 'ProfileScreenMsg', subMsg: msg })
          }
          isCurrentUser={isCurrentUser}
        />
      )
    }

    case 'EditorScreenModel':
      return (
        <EditorScreenMemo
          model={screenModel.model}
          dispatch={(msg) => dispatch({ _tag: 'EditorScreenMsg', subMsg: msg })}
        />
      )
    case 'NotFoundScreenModel':
      return <NotFoundScreenMemo />
  }
}
