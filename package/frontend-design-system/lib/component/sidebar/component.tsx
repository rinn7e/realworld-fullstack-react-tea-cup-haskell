import { cn } from '@rinn7e/tea-cup-prelude'
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  User as UserIcon,
} from 'lucide-react'
import React, { memo } from 'react'

import { ButtonMemo as DsButtonMemo } from '../../element/button/component'
import type { NavItemData } from '../../type/nav-item'
import { GenericLink } from '../generic-link'
import type { SidebarCategory, SidebarProps } from './type'
import { SidebarPropsEq } from './type'

export const SidebarComponent: React.FC<SidebarProps> = ({
  model,
  items,
  categories,
  dispatch,
  brandTitle = 'conduit',
  brandLogo,
  userProfile,
  align = 'left',
  className,
  dataTest,
}) => {
  const isCollapsed = model.collapsed

  const activeCls =
    'bg-green-50 text-green-600 font-semibold dark:bg-green-950/40 dark:text-green-400'
  const inactiveCls =
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'

  const normalizedCategories: SidebarCategory[] = categories
    ? categories
    : items
      ? [{ title: '', items }]
      : []

  const renderItem = (item: NavItemData, depth = 0) => {
    const hasChildren = Boolean(item.children && item.children.length > 0)
    const isExpanded = model.expandedKeys
      ? model.expandedKeys.includes(item.key)
      : false

    const handleClick = (e: React.MouseEvent) => {
      if (hasChildren) {
        e.preventDefault()
        dispatch({ _tag: 'ToggleExpand', key: item.key })
      }
      dispatch({ _tag: 'ClickItem', item })
    }

    return (
      <li key={item.key} className='space-y-1'>
        <GenericLink
          className={cn(
            'flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors select-none',
            item.isActive ? activeCls : inactiveCls,
            isCollapsed && 'justify-center px-0',
            depth > 0 && !isCollapsed && 'pl-7 text-xs',
          )}
          href={hasChildren ? undefined : item.href}
          onClick={handleClick}
          dispatch={dispatch}
          msg={
            hasChildren || item.isNewTab
              ? undefined
              : { _tag: 'ClickItem', item }
          }
          isNewTab={item.isNewTab}
          data-test='nav-link'
          aria-current={item.isActive ? 'page' : undefined}
        >
          <div className='flex items-center gap-3 truncate'>
            <span className='shrink-0'>{item.icon}</span>
            {!isCollapsed && <span className='truncate'>{item.label}</span>}
          </div>

          {hasChildren && !isCollapsed && (
            <span className='shrink-0 text-gray-400 dark:text-slate-500'>
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </span>
          )}
        </GenericLink>

        {hasChildren && isExpanded && !isCollapsed && (
          <ul className='ml-3 space-y-1 border-l border-gray-100 pl-2 dark:border-slate-800'>
            {item.children!.map((child) => renderItem(child, depth + 1))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <aside
      data-test={dataTest || 'sidebar'}
      data-component='Sidebar'
      className={cn(
        'flex h-full shrink-0 flex-col overflow-hidden bg-white transition-all duration-300 ease-in-out select-none dark:bg-slate-900',
        align === 'right'
          ? 'border-l border-gray-200 dark:border-slate-800'
          : 'border-r border-gray-200 dark:border-slate-800',
        isCollapsed ? 'w-[64px]' : 'w-[240px]',
        className,
      )}
    >
      {/* Header / Brand */}
      <div
        className={cn(
          'flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-3 dark:border-slate-800',
          align === 'right' && 'flex-row-reverse',
        )}
      >
        {!isCollapsed ? (
          <div className='flex items-center gap-2 truncate overflow-hidden'>
            {brandLogo}
            <span className='truncate text-lg font-bold text-green-600 dark:text-green-400'>
              {brandTitle}
            </span>
          </div>
        ) : (
          brandLogo && <div className='mx-auto'>{brandLogo}</div>
        )}
        <DsButtonMemo
          color='gray'
          variant='ghost'
          size='small'
          onClick={() => dispatch({ _tag: 'ToggleCollapsed' })}
          className={cn(
            'p-1 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200',
            isCollapsed && 'mx-auto',
          )}
        >
          {align === 'right' ? (
            isCollapsed ? (
              <PanelRightOpen size={20} />
            ) : (
              <PanelRightClose size={20} />
            )
          ) : isCollapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </DsButtonMemo>
      </div>

      {/* Nav List */}
      <div className='flex-1 space-y-3 overflow-y-auto p-2'>
        {normalizedCategories.map((cat, idx) => (
          <div key={cat.title || idx} className='space-y-1'>
            {cat.title && (
              <>
                {!isCollapsed ? (
                  <div className='px-3 pt-2 pb-1 text-left text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-500'>
                    {cat.title}
                  </div>
                ) : (
                  idx > 0 && (
                    <div className='my-1 border-t border-gray-100 dark:border-slate-800' />
                  )
                )}
              </>
            )}
            <ul className='space-y-1'>
              {cat.items.map((item) => renderItem(item))}
            </ul>
          </div>
        ))}
      </div>

      {/* User Footer Section */}
      {userProfile && (
        <div className='flex shrink-0 items-center gap-3 overflow-hidden border-t border-gray-100 p-3 dark:border-slate-800'>
          <div className='flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xs font-semibold text-gray-600 dark:bg-slate-800 dark:text-slate-300'>
            {userProfile.avatar || <UserIcon size={18} />}
          </div>
          {!isCollapsed && (
            <div className='flex min-w-0 flex-col truncate text-left'>
              <span className='truncate text-xs font-semibold text-gray-800 dark:text-slate-200'>
                {userProfile.name}
              </span>
              {userProfile.subtitle && (
                <span className='truncate text-[10px] text-gray-500 dark:text-slate-400'>
                  {userProfile.subtitle}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

export const SidebarMemo = memo(SidebarComponent, SidebarPropsEq.equals)
