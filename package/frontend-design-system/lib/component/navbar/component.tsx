import React, { memo } from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { GenericLink } from '../generic-link'
import type { NavItemData } from '../../type/nav-item'
import { cn } from '../../theme'

import type { Props } from './type'
import { PropsEq } from './type'

export const NavLinks = <PMsg,>({
  items,
  dispatch,
}: {
  items: NavItemData<PMsg>[]
  dispatch: Dispatcher<PMsg>
}) => {
  const activeCls = 'text-green-600'
  const inactiveCls = 'text-gray-500 hover:text-gray-900'

  return (
    <>
      {items.map((item) => {
        const baseCls = item.icon
          ? 'flex items-center gap-[4px] rounded px-[12px] py-[6px] text-sm'
          : 'block rounded px-[12px] py-[6px] text-sm'

        return (
          <li key={item.key}>
            <GenericLink
              className={cn(baseCls, item.isActive ? activeCls : inactiveCls)}
              href={item.href}
              dispatch={dispatch}
              msg={item.onClick}
              data-test='nav-link'
              aria-current={item.isActive ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </GenericLink>
          </li>
        )
      })}
    </>
  )
}

export const NavbarComponent = <PMsg,>({
  config,
  dispatch,
}: Props<PMsg>) => {
  const { brandNavItem, desktopNavItems, mobileNavItems, unavailableMode } =
    config

  return (
    <nav
      className='sticky top-0 z-20 border-b border-gray-100 bg-white shadow-sm'
      data-test='navbar'
    >
      <div className='mx-auto max-w-[1152px] px-[16px]'>
        <div className='flex h-[56px] items-center justify-between'>
          {brandNavItem && (
            <GenericLink
              className='text-xl font-bold tracking-tight text-green-600'
              href={brandNavItem.href}
              dispatch={dispatch}
              msg={brandNavItem.onClick}
              data-test='site-logo'
            >
              {brandNavItem.label}
            </GenericLink>
          )}

          {unavailableMode && (
            <span
              className='ml-[16px] flex items-center gap-[6px] text-sm text-gray-400'
              data-test='app-connecting-state'
            >
              <div className='h-[8px] w-[8px] animate-pulse rounded-full bg-amber-400' />
              Connecting
            </span>
          )}

          {/* mobile nav items */}
          <div className='flex items-center gap-[4px] lg:hidden'>
            {mobileNavItems.map((item) => (
              <GenericLink
                key={item.key}
                className='rounded p-[8px] text-gray-500 hover:text-gray-900'
                href={item.href || '#'}
                dispatch={dispatch}
                msg={item.onClick}
              >
                {item.icon}
                {item.label}
              </GenericLink>
            ))}
          </div>

          {/* desktop nav links */}
          <ul className='hidden lg:flex lg:items-center lg:gap-[4px]'>
            <NavLinks items={desktopNavItems} dispatch={dispatch} />
          </ul>
        </div>
      </div>
    </nav>
  )
}

export const NavbarMemo = memo(
  NavbarComponent,
  PropsEq.equals as (x: Props<unknown>, y: Props<unknown>) => boolean,
) as <PMsg>(props: Props<PMsg>) => React.ReactElement | null
