import { cn } from '@rinn7e/tea-cup-prelude'
import { ChevronDown } from 'lucide-react'
import React, { memo } from 'react'

import { ButtonMemo as DsButtonMemo } from '../../element/button/component'
import type { NavItemData } from '../../type/nav-item'
import { GenericLink } from '../generic-link'
import type { Msg, NavbarProps } from './type'
import { NavbarPropsEq } from './type'

export const NavItemView: React.FC<{
  item: NavItemData
  model: NavbarProps['model']
  dispatch: (msg: Msg) => void
}> = ({ item, model, dispatch }) => {
  const activeCls = 'text-green-600 font-semibold'
  const inactiveCls =
    'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100'

  if (item.children && item.children.length > 0) {
    const isOpen = model.openDropdownKey === item.key

    return (
      <li className='relative'>
        <DsButtonMemo
          color='gray'
          variant='ghost'
          size='normal'
          onClick={() => dispatch({ _tag: 'ToggleDropdown', key: item.key })}
          className={cn(
            'flex items-center gap-[4px] px-[12px] py-[6px] text-sm',
            item.isActive ? activeCls : inactiveCls,
          )}
        >
          {item.icon}
          {item.label}
          <ChevronDown
            size={16}
            className={cn(
              'transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
          />
        </DsButtonMemo>

        {isOpen && (
          <div className='absolute right-0 z-30 mt-[4px] w-[180px] rounded-md border border-gray-100 bg-white p-[4px] shadow-lg dark:border-zinc-800 dark:bg-zinc-900'>
            {item.children.map((child) => (
              <GenericLink
                key={child.key}
                href={child.href || '#'}
                className={cn(
                  'block rounded px-[12px] py-[6px] text-sm transition-colors',
                  child.isActive
                    ? 'bg-green-50 font-semibold text-green-600 dark:bg-green-950/50'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-800',
                )}
                dispatch={dispatch}
                msg={{ _tag: 'ClickNavItem', item: child }}
              >
                {child.label}
              </GenericLink>
            ))}
          </div>
        )}
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
        href={item.href || '#'}
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
  model: NavbarProps['model']
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
  dataTest,
}) => {
  const { brandNavItem, desktopNavItems, mobileNavItems, unavailableMode } =
    config

  return (
    <nav
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
              href={brandNavItem.href || '#'}
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
