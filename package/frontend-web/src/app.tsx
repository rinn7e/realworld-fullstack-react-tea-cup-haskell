import { FloatingSidebarMemo as DsFloatingFloatingSidebarMemo } from '@rinn7e/realworld-design-system/component/floating-sidebar/component'
import { NavbarMemo as DsNavbarMemo } from '@rinn7e/realworld-design-system/component/navbar/component'
import { cn } from '@rinn7e/tea-cup-prelude'
import * as TeaRouter from '@rinn7e/tea-cup-router'
import React from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { SetGlobalMsgContext } from './common/global-context'
import { toDesktopNavItems, toNavbarConfig } from './common/nav-link-helper'
import { DebugPanelComponent } from './component/debug-panel/component'
import { Footer } from './component/footer'
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
  const isNavOpen = model.sidebar.status.state._tag !== 'Invisible'
  const desktopNavItems = toDesktopNavItems(model)
  const navbarConfig = toNavbarConfig(model)

  return (
    <SetGlobalMsgContext value={dispatch}>
      <div
        className={cn(
          'yo flex min-h-dvh flex-col bg-white text-gray-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100',
          isNavOpen && 'h-dvh overflow-hidden',
        )}
      >
        <DsNavbarMemo
          model={model.navbar}
          config={navbarConfig}
          dispatch={(subMsg) => dispatch({ _tag: 'NavbarMsg', subMsg })}
        />
        <main className='flex-grow'>{renderPage(model, dispatch)}</main>
        <Footer />
      </div>
      <DsFloatingFloatingSidebarMemo
        model={model.sidebar}
        items={desktopNavItems.map((n) => n.data)}
        dispatch={(subMsg) => dispatch({ _tag: 'SidebarMsg', subMsg })}
      />
      <DebugPanelComponent
        model={model.debugPanel}
        dispatch={(msg) => dispatch({ _tag: 'DebugPanelMsg', subMsg: msg })}
      />
    </SetGlobalMsgContext>
  )
}

const renderPage = (model: Model, dispatch: Dispatcher<Msg>) => {
  const pageModel = TeaRouter.getPageModel(model.router)
  const route = TeaRouter.getRoute(model.router)

  switch (pageModel._tag) {
    case 'HomePageModel':
      return (
        <HomePageMemo
          model={pageModel.model}
          shared={model.shared}
          dispatch={(msg) => dispatch({ _tag: 'HomePageMsg', subMsg: msg })}
        />
      )
    case 'ArticlePageModel':
      return (
        <ArticlePageMemo
          model={pageModel.model}
          user={model.shared.user}
          dispatch={(msg) => dispatch({ _tag: 'ArticlePageMsg', subMsg: msg })}
        />
      )
    case 'LoginPageModel':
      return (
        <LoginPageMemo
          model={pageModel.model}
          dispatch={(msg) => dispatch({ _tag: 'LoginPageMsg', subMsg: msg })}
        />
      )
    case 'SignupPageModel':
      return (
        <SignupPageMemo
          model={pageModel.model}
          dispatch={(msg) => dispatch({ _tag: 'SignupPageMsg', subMsg: msg })}
        />
      )
    case 'SettingsPageModel':
      return (
        <SettingsPageMemo
          model={pageModel.model}
          dispatch={(msg) => dispatch({ _tag: 'SettingsPageMsg', subMsg: msg })}
        />
      )
    case 'ProfilePageModel': {
      const isCurrentUser =
        model.shared.user._tag === 'Some' &&
        model.shared.user.value.username ===
          (pageModel.model.profile._tag === 'RemoteSuccess'
            ? pageModel.model.profile.value.profile.username
            : '')

      return (
        <ProfilePageMemo
          model={pageModel.model}
          shared={model.shared}
          dispatch={(msg) => dispatch({ _tag: 'ProfilePageMsg', subMsg: msg })}
          isCurrentUser={isCurrentUser}
          route={route}
        />
      )
    }

    case 'EditorPageModel':
      return (
        <EditorPageMemo
          model={pageModel.model}
          dispatch={(msg) => dispatch({ _tag: 'EditorPageMsg', subMsg: msg })}
        />
      )
    case 'NotFoundPageModel':
      return <NotFoundView />
  }
}
