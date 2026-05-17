import { cn } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Menu, Pencil, Settings, X } from 'lucide-react'
import React from 'react'
import { createPortal } from 'react-dom'
import type { Dispatcher } from 'tea-cup-fp'

import type { User } from '@/common/api'
import { homePage } from '@/common/type/route'
import { assetPath } from '@/common/util'
import { Link } from '@/component/link'
import type { Model, Msg } from '@/type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const Navbar: React.FC<Props> = ({ model, dispatch }) => {
  const user = model.shared.user
  const pageTag = model.pageModel._tag

  const isHome = pageTag === 'HomePageModel'
  const isEditor = pageTag === 'EditorPageModel'
  const isSettings = pageTag === 'SettingsPageModel'
  const isProfile = pageTag === 'ProfilePageModel'
  const isLogin = pageTag === 'LoginPageModel'
  const isSignup = pageTag === 'SignupPageModel'

  const activeCls = 'text-green-600'
  const inactiveCls = 'text-gray-500 hover:text-gray-900'

  const links = (_isSidebar: boolean) => (
    <>
      <li>
        <Link
          className={cn(
            // shared
            'block rounded px-[12px] py-[6px] text-sm',
            // state
            isHome ? activeCls : inactiveCls,
          )}
          route={{ page: homePage() }}
          data-test='nav-link'
          aria-current={isHome ? 'page' : undefined}
        >
          Home
        </Link>
      </li>
      {pipe(user, (optUser: Option<User>) =>
        optUser._tag === 'Some' ? (
          <>
            <li>
              <Link
                className={cn(
                  // shared
                  'flex items-center gap-[4px] rounded px-[12px] py-[6px] text-sm',
                  // state
                  isEditor ? activeCls : inactiveCls,
                )}
                route={{ page: { _tag: 'EditorPage', slug: O.none } }}
                data-test='nav-link'
                aria-current={isEditor ? 'page' : undefined}
              >
                <Pencil size={14} />
                New Article
              </Link>
            </li>
            <li>
              <Link
                className={cn(
                  // shared
                  'flex items-center gap-[4px] rounded px-[12px] py-[6px] text-sm',
                  // state
                  isSettings ? activeCls : inactiveCls,
                )}
                route={{ page: { _tag: 'SettingsPage' } }}
                data-test='nav-link'
                aria-current={isSettings ? 'page' : undefined}
              >
                <Settings size={14} />
                Settings
              </Link>
            </li>
            <li>
              <Link
                className={cn(
                  // shared
                  'flex items-center gap-[8px] rounded px-[12px] py-[6px] text-sm',
                  // state
                  isProfile ? activeCls : inactiveCls,
                )}
                route={{
                  page: {
                    _tag: 'ProfilePage',
                    username: optUser.value.username,
                    favorites: false,
                  },
                }}
                data-test='nav-link'
                aria-current={isProfile ? 'page' : undefined}
              >
                <img
                  src={assetPath(optUser.value.image || '/default-avatar.svg')}
                  className='h-[28px] w-[28px] rounded-full object-cover'
                  alt=''
                  data-test='navbar-user-avatar'
                />
                {optUser.value.username}
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                className={cn(
                  'rounded px-[12px] py-[6px] text-sm',
                  isLogin ? activeCls : inactiveCls,
                )}
                route={{ page: { _tag: 'LoginPage' } }}
                data-test='nav-link'
                aria-current={isLogin ? 'page' : undefined}
              >
                Sign in
              </Link>
            </li>
            <li>
              <Link
                className={cn(
                  'rounded px-[12px] py-[6px] text-sm',
                  isSignup ? activeCls : inactiveCls,
                )}
                route={{ page: { _tag: 'SignupPage' } }}
                data-test='nav-link'
                aria-current={isSignup ? 'page' : undefined}
              >
                Sign up
              </Link>
            </li>
          </>
        ),
      )}
    </>
  )

  const animate = model.navbarMobileOpen
  const state = animate.state._tag
  const isVisible = state !== 'Invisible'

  const backdropCls = cn(
    'absolute inset-0 bg-black/50',
    state === 'AnimateIn' && 'animate-fade-in',
    state === 'AnimateOut' && 'animate-fade-out',
  )

  const sidebarCls = cn(
    'relative flex flex-col w-[280px] h-full bg-white shadow-xl p-[16px] overflow-y-auto',
    state === 'AnimateIn' && 'animate-slide-in',
    state === 'AnimateOut' && 'animate-slide-out',
  )

  return (
    <nav
      className='sticky top-0 z-20 border-b border-gray-100 bg-white shadow-sm'
      data-test='navbar'
    >
      <div className='mx-auto max-w-[1152px] px-[16px]'>
        <div className='flex h-[56px] items-center justify-between'>
          <Link
            className='text-xl font-bold tracking-tight text-green-600'
            route={{ page: homePage() }}
            data-test='site-logo'
          >
            conduit
          </Link>

          {model.unavailableMode && (
            <span
              className='ml-[16px] flex items-center gap-[6px] text-sm text-gray-400'
              data-test='app-connecting-state'
            >
              <div className='h-[8px] w-[8px] animate-pulse rounded-full bg-amber-400' />
              Connecting
            </span>
          )}

          {/* mobile hamburger button */}
          <button
            type='button'
            className='p-[8px] text-gray-500 hover:text-gray-900 focus:outline-none lg:hidden'
            onClick={() => dispatch({ _tag: 'ToggleNavbarMobile', open: true })}
          >
            <Menu size={24} />
          </button>

          {/* desktop nav links */}
          <ul className='hidden lg:flex lg:items-center lg:gap-[4px]'>
            {links(false)}
          </ul>
        </div>
      </div>

      {/* mobile sidebar portal */}
      {isVisible &&
        createPortal(
          <div className='absolute inset-0 z-[100] flex justify-end overflow-hidden'>
            {/* backdrop */}
            <div
              className={backdropCls}
              onClick={() =>
                dispatch({ _tag: 'ToggleNavbarMobile', open: false })
              }
            />
            {/* sidebar content */}
            <div className={sidebarCls}>
              <div className='flex flex-col gap-[16px]'>
                <div className='flex items-center justify-between'>
                  <span className='text-xl font-bold text-green-600'>
                    conduit
                  </span>
                  <button
                    type='button'
                    className='p-[8px] text-gray-500 hover:text-gray-900 focus:outline-none'
                    onClick={() =>
                      dispatch({ _tag: 'ToggleNavbarMobile', open: false })
                    }
                  >
                    <X size={24} />
                  </button>
                </div>
                <ul className='flex flex-col gap-[8px]'>{links(true)}</ul>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </nav>
  )
}
