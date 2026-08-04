import React, { memo } from 'react'

import { cn } from '../../theme'
import type { NavItemData } from '../../type/nav-item'
import { GenericLink } from '../generic-link'
import { PopoverMemo as DsPopoverMemo } from '../popover/component'
import type { Model, Msg, NavbarProps } from './type'
import { NavbarPropsEq } from './type'

export const NavItemView: React.FC<{
  item: NavItemData
  model: Model
  dispatch: (msg: Msg) => void
}> = ({ item, model, dispatch }) => {
  const activeCls = 'text-green-600 dark:text-green-400 font-semibold'
  const inactiveCls =
    'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100'

  if (item.children && item.children.length > 0) {
    const isOpen = model.openDropdownKey === item.key

    const popoverModel = { isOpen }
    const popoverDispatch = (popoverMsg: { _tag: string }) => {
      if (popoverMsg._tag === 'Toggle') {
        dispatch({ _tag: 'ToggleDropdown', key: item.key })
      } else if (popoverMsg._tag === 'Close') {
        dispatch({ _tag: 'CloseDropdown' })
      }
    }

    const trigger = (
      <button
        type='button'
        className={cn(
          'flex cursor-pointer items-center gap-1.5 rounded px-[12px] py-[6px] text-sm font-medium transition-colors',
          item.isActive ? activeCls : inactiveCls,
        )}
        aria-expanded={isOpen}
      >
        {item.icon}
        {item.label && <span>{item.label}</span>}
      </button>
    )

    return (
      <li>
        <DsPopoverMemo
          model={popoverModel}
          dispatch={popoverDispatch}
          trigger={trigger}
          align='right'
          cardClassName='w-36 p-1'
        >
          <div className='flex flex-col gap-0.5'>
            {item.children.map((child) => {
              const isChildActive = child.isActive
              return (
                <button
                  key={child.key}
                  type='button'
                  onClick={() => {
                    dispatch({ _tag: 'CloseDropdown' })
                    dispatch({ _tag: 'ClickNavItem', item: child })
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium transition-colors',
                    isChildActive
                      ? 'bg-emerald-100/60 font-semibold text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'text-gray-700 hover:bg-gray-100/70 dark:text-zinc-200 dark:hover:bg-zinc-900',
                  )}
                >
                  {child.icon && <span className='shrink-0'>{child.icon}</span>}
                  <span>{child.label}</span>
                </button>
              )
            })}
          </div>
        </DsPopoverMemo>
      </li>
    )
  }

  const baseCls = item.icon
    ? 'flex items-center gap-[4px] rounded px-[12px] py-[6px] text-sm'
    : 'block rounded px-[12px] py-[6px] text-sm'

  return (
    <li>
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
}

export const NavLinks: React.FC<{
  items: NavItemData[]
  model: Model
  dispatch: (msg: Msg) => void
}> = ({ items, model, dispatch }) => {
  return (
    <>
      {items.map((item) => (
        <NavItemView
          key={item.key}
          item={item}
          model={model}
          dispatch={dispatch}
        />
      ))}
    </>
  )
}

export const NavbarComponent: React.FC<NavbarProps> = ({
  config,
  model,
  dispatch,
  className,
  containerClassName,
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
        'sticky top-0 z-20 border-b border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-black',
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
              <NavLinks
                items={desktopNavItems}
                model={model}
                dispatch={dispatch}
              />
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export const NavbarMemo = memo(NavbarComponent, NavbarPropsEq.equals)
