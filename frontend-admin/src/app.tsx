import React from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import {
  articlesPage,
  commentsPage,
  homePage,
  settingsPage,
  usersPage,
  visitorsPage,
  type AppRoute,
} from '@/common/type/route'
import { Link } from '@/component/link'
import { PersonaPanel } from '@/component/persona-panel/persona-panel'
import { ArticlesMemo } from '@/page/articles/component'
import { CommentsMemo } from '@/page/comments/component'
import { HomeMemo } from '@/page/home/component'
import { LoginMemo } from '@/page/login/component'
import { SettingsComponent } from '@/page/settings/component'
import { UsersMemo } from '@/page/users/component'
import { VisitorsMemo } from '@/page/visitors/component'

import { SetGlobalMsgContext } from '@/common/global-context'
import { type Model, type Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

// TODO: Implement mobile-first sidebar toggle for better responsiveness
export const App: React.FC<Props> = ({ model, dispatch }) => {
  // If we are on the login page, show a different layout (no sidebar)
  if (model.route.page._tag === 'LoginPage') {
    return (
      <SetGlobalMsgContext value={dispatch}>
        <main className='h-dvh bg-gray-50 dark:bg-black'>
          {renderPage(model, dispatch)}
          <PersonaPanel
            model={model.persona}
            theme={model.theme}
            colorScheme={model.colorScheme}
            dispatch={(subMsg) => dispatch({ _tag: 'PersonaMsg', subMsg })}
            onSwitchTheme={(theme) => dispatch({ _tag: 'SwitchTheme', theme })}
          />
        </main>
      </SetGlobalMsgContext>
    )
  }

  return (
    <SetGlobalMsgContext value={dispatch}>
      <div className='flex h-dvh flex-col overflow-hidden bg-gray-50 lg:flex-row dark:bg-black'>
        {/* Sidebar */}
        <aside className='bg-theme-secondary flex w-full flex-col text-white lg:w-[260px] lg:shrink-0'>
          <div className='p-[24px]'>
            <Link
              route={{ page: homePage() }}
              className='text-left transition-opacity hover:opacity-85 block'
            >
              <h1 className='text-[22px] font-bold tracking-tight text-white hover:underline'>
                Sentinel Dashboard
              </h1>
            </Link>
          </div>
          <nav className='mt-[20px] flex flex-col gap-[4px] px-[12px]'>
            <SidebarLink
              label='Overview'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-[20px] w-[20px]'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              }
              active={model.route.page._tag === 'HomePage'}
              route={{ page: homePage() }}
            />
            <SidebarLink
              label='Articles'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-[20px] w-[20px]'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 11h5m-5 4h5m-9-8h9M7 11h.01M7 15h.01M7 7h.01'
                  />
                </svg>
              }
              active={model.route.page._tag === 'ArticlesPage'}
              route={{ page: articlesPage() }}
            />
            <SidebarLink
              label='Users'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-[20px] w-[20px]'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                  />
                </svg>
              }
              active={model.route.page._tag === 'UsersPage'}
              route={{ page: usersPage() }}
            />
            <SidebarLink
              label='Comments'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-[20px] w-[20px]'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                  />
                </svg>
              }
              active={model.route.page._tag === 'CommentsPage'}
              route={{ page: commentsPage() }}
            />
            <SidebarLink
              label='Visitors'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-[20px] w-[20px]'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              }
              active={model.route.page._tag === 'VisitorsPage'}
              route={{ page: visitorsPage() }}
            />
            <SidebarLink
              label='Settings'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-[20px] w-[20px]'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              }
              active={model.route.page._tag === 'SettingsPage'}
              route={{ page: settingsPage() }}
            />
          </nav>
        </aside>

        {/* Main Content */}
        <main
          id='main-content'
          className='relative flex-grow overflow-y-auto p-[24px] lg:p-[40px]'
          onScroll={(e) => {
            const target = e.currentTarget
            const shouldShow = target.scrollTop > 300
            if (shouldShow !== model.showScrollTop) {
              dispatch({ _tag: 'SetShowScrollTop', value: shouldShow })
            }
          }}
        >
          {renderPage(model, dispatch)}

          {/* Scroll to Top Button */}
          {model.showScrollTop && model.route.page._tag !== 'HomePage' && (
            <button
              type='button'
              onClick={() => dispatch({ _tag: 'ScrollToTop' })}
              className='bg-theme-primary fixed right-[32px] bottom-[32px] z-[50] flex h-[48px] w-[48px] items-center justify-center rounded-full text-white shadow-2xl transition-all hover:scale-110 active:scale-95'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-[24px] w-[24px]'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 10l7-7m0 0l7 7m-7-7v18'
                />
              </svg>
            </button>
          )}
        </main>

        <PersonaPanel
          model={model.persona}
          theme={model.theme}
          colorScheme={model.colorScheme}
          dispatch={(subMsg) => dispatch({ _tag: 'PersonaMsg', subMsg })}
          onSwitchTheme={(theme) => dispatch({ _tag: 'SwitchTheme', theme })}
        />
      </div>
    </SetGlobalMsgContext>
  )
}

const SidebarLink: React.FC<{
  label: string
  icon: React.ReactNode
  active: boolean
  route: AppRoute
}> = ({ label, icon, active, route }) => (
  <Link
    route={route}
    className={`flex w-full items-center gap-[12px] rounded-[8px] px-[16px] py-[12px] text-left transition-all duration-200 ${
      active
        ? 'bg-theme-primary shadow-theme-primary/20 text-white shadow-lg'
        : 'text-white/60 hover:bg-white/10 hover:text-white'
    }`}
  >
    <span className='shrink-0'>{icon}</span>
    <span className='font-medium'>{label}</span>
  </Link>
)

const renderPage = (model: Model, dispatch: Dispatcher<Msg>) => {
  switch (model.pageModel._tag) {
    case 'HomePageModel':
      return (
        <HomeMemo
          model={model.pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'HomePageMsg', subMsg })}
        />
      )
    case 'ArticlesPageModel':
      return (
        <ArticlesMemo
          model={model.pageModel.model}
          shared={model.shared}
          dispatch={(subMsg) => dispatch({ _tag: 'ArticlesPageMsg', subMsg })}
        />
      )
    case 'UsersPageModel':
      return (
        <UsersMemo
          model={model.pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'UsersPageMsg', subMsg })}
        />
      )
    case 'CommentsPageModel':
      return (
        <CommentsMemo
          model={model.pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'CommentsPageMsg', subMsg })}
        />
      )
    case 'VisitorsPageModel':
      return (
        <VisitorsMemo
          model={model.pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'VisitorsPageMsg', subMsg })}
        />
      )
    case 'LoginPageModel':
      return (
        <LoginMemo
          model={model.pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'LoginPageMsg', subMsg })}
        />
      )
    case 'SettingsPageModel':
      return (
        <SettingsComponent
          user={model.shared.user}
          colorScheme={model.colorScheme}
          theme={model.theme}
          dispatch={dispatch}
        />
      )
    case 'NotFoundPageModel':
      return (
        <div className='flex h-full items-center justify-center text-[24px] font-bold text-slate-400'>
          404 Not Found
        </div>
      )
  }
}
