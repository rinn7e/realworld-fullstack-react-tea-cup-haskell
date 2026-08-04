import React, { memo } from 'react'

import { cn } from '../../theme'
import type { NavItemData } from '../../type/nav-item'
import { GenericLink } from '../generic-link'
import type { Msg, NavbarProps } from './type'
import { NavbarPropsEq } from './type'

export const NavLinks: React.FC<{
  items: NavItemData[]
  dispatch: (msg: Msg) => void
}> = ({ items, dispatch }) => {
  const activeCls = 'text-green-600 dark:text-green-400 font-semibold'
  const inactiveCls =
    'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100'

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
              msg={{ _tag: 'ClickNavItem', item }}
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

export const NavbarComponent: React.FC<NavbarProps> = ({
  config,
  dispatch,
  className,
  containerClassName,
  endSlot,
  key,
  dataTest,
}) => {
  const { brandNavItem, desktopNavItems, mobileNavItems, unavailableMode } =
    config

  return (
    <nav
      key={key}
      data-test={dataTest}
      data-component='Navbar'
      className={cn(
        'sticky top-0 z-20 border-b border-gray-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      <div className={cn('mx-auto max-w-7xl px-4', containerClassName)}>
        <div className='flex h-[56px] items-center justify-between'>
          {brandNavItem && (
            <GenericLink
              className='text-xl font-bold tracking-tight text-green-600 dark:text-green-400'
              href={brandNavItem.href}
              dispatch={dispatch}
              msg={{ _tag: 'ClickNavItem', item: brandNavItem }}
              data-test='site-logo'
            >
              {brandNavItem.label}
            </GenericLink>
          )}

          {unavailableMode && (
            <span
              className='ml-[16px] flex items-center gap-[6px] text-sm text-gray-400 dark:text-slate-500'
              data-test='app-connecting-state'
            >
              <div className='h-[8px] w-[8px] animate-pulse rounded-full bg-amber-400' />
              Connecting
            </span>
          )}

          <div className='flex items-center gap-3'>
            {/* mobile nav items */}
            <div className='flex items-center gap-[4px] lg:hidden'>
              {mobileNavItems.map((item) => (
                <GenericLink
                  key={item.key}
                  className='rounded p-[8px] text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100'
                  href={item.href || '#'}
                  dispatch={dispatch}
                  msg={{ _tag: 'ClickNavItem', item }}
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

            {endSlot}
          </div>
        </div>
      </div>
    </nav>
  )
}

export const NavbarMemo = memo(NavbarComponent, NavbarPropsEq.equals)
