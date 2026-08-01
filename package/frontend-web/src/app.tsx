import { cn } from '@rinn7e/tea-cup-prelude'
import React from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { SetGlobalMsgContext } from './common/global-context'
import { DebugPanelComponent } from './component/debug-panel/component'
import { Footer } from './component/footer'
import { Navbar } from './component/navbar'
import { ArticlePageMemo } from './page/article/component'
import { EditorPageMemo } from './page/editor/component'
import { HomePageMemo } from './page/home/component'
import { LoginPageMemo } from './page/login/component'
import { NotFoundView } from './page/not-found'
import { ProfilePageMemo } from './page/profile/component'
import { SettingsPageMemo } from './page/settings/component'
import { SignupPageMemo } from './page/signup/component'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const App: React.FC<Props> = ({ model, dispatch }) => {
  const isNavOpen = model.navbarMobileOpen.state._tag !== 'Invisible'

  return (
    <SetGlobalMsgContext value={dispatch}>
      <div
        className={cn(
          'flex min-h-dvh flex-col yo',
          isNavOpen && 'h-dvh overflow-hidden',
        )}
      >
        <Navbar model={model} dispatch={dispatch} />
        <main className='flex-grow'>{renderPage(model, dispatch)}</main>
        <Footer />
      </div>
      <DebugPanelComponent
        model={model.debugPanel}
        dispatch={(msg) => dispatch({ _tag: 'DebugPanelMsg', subMsg: msg })}
      />
    </SetGlobalMsgContext>
  )
}

const renderPage = (model: Model, dispatch: Dispatcher<Msg>) => {
  switch (model.pageModel._tag) {
    case 'HomePageModel':
      return (
        <HomePageMemo
          model={model.pageModel.model}
          shared={model.shared}
          dispatch={(msg) => dispatch({ _tag: 'HomePageMsg', subMsg: msg })}
        />
      )
    case 'ArticlePageModel':
      return (
        <ArticlePageMemo
          model={model.pageModel.model}
          user={model.shared.user}
          dispatch={(msg) => dispatch({ _tag: 'ArticlePageMsg', subMsg: msg })}
        />
      )
    case 'LoginPageModel':
      return (
        <LoginPageMemo
          model={model.pageModel.model}
          dispatch={(msg) => dispatch({ _tag: 'LoginPageMsg', subMsg: msg })}
        />
      )
    case 'SignupPageModel':
      return (
        <SignupPageMemo
          model={model.pageModel.model}
          dispatch={(msg) => dispatch({ _tag: 'SignupPageMsg', subMsg: msg })}
        />
      )
    case 'SettingsPageModel':
      return (
        <SettingsPageMemo
          model={model.pageModel.model}
          dispatch={(msg) => dispatch({ _tag: 'SettingsPageMsg', subMsg: msg })}
        />
      )
    case 'ProfilePageModel': {
      const isCurrentUser =
        model.shared.user._tag === 'Some' &&
        model.shared.user.value.username ===
          (model.pageModel.model.profile._tag === 'RemoteSuccess'
            ? model.pageModel.model.profile.value.profile.username
            : '')

      return (
        <ProfilePageMemo
          model={model.pageModel.model}
          shared={model.shared}
          dispatch={(msg) => dispatch({ _tag: 'ProfilePageMsg', subMsg: msg })}
          isCurrentUser={isCurrentUser}
          route={model.route}
        />
      )
    }

    case 'EditorPageModel':
      return (
        <EditorPageMemo
          model={model.pageModel.model}
          dispatch={(msg) => dispatch({ _tag: 'EditorPageMsg', subMsg: msg })}
        />
      )
    case 'NotFoundPageModel':
      return <NotFoundView />
  }
}
