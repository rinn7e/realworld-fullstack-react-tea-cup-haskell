import { cn } from '@rinn7e/tea-cup-prelude'
import {
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
  key,
  dataTest,
}) => {
  const isCollapsed = model.collapsed

  const activeCls = 'bg-green-50 text-green-600 font-semibold'
  const inactiveCls = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'

  const normalizedCategories: SidebarCategory[] = categories
    ? categories
    : items
      ? [{ title: '', items }]
      : []

  const renderItem = (item: NavItemData) => (
    <li key={item.key}>
      <GenericLink
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
          item.isActive ? activeCls : inactiveCls,
          isCollapsed && 'justify-center px-0',
        )}
        href={item.href}
        dispatch={dispatch}
        msg={item.isNewTab ? undefined : { _tag: 'ClickItem', item }}
        isNewTab={item.isNewTab}
        data-test='nav-link'
        aria-current={item.isActive ? 'page' : undefined}
      >
        <span className='shrink-0'>{item.icon}</span>
        {!isCollapsed && <span className='truncate'>{item.label}</span>}
      </GenericLink>
    </li>
  )

  return (
    <aside
      key={key}
      data-test={dataTest || 'sidebar'}
      data-component='Sidebar'
      className={cn(
        'flex flex-col h-full bg-white transition-all duration-300 ease-in-out shrink-0 select-none overflow-hidden',
        align === 'right'
          ? 'border-l border-gray-200'
          : 'border-r border-gray-200',
        isCollapsed ? 'w-[64px]' : 'w-[240px]',
        className,
      )}
    >
      {/* Header / Brand */}
      <div
        className={cn(
          'flex items-center justify-between h-14 px-3 border-b border-gray-100 shrink-0',
          align === 'right' && 'flex-row-reverse',
        )}
      >
        {!isCollapsed ? (
          <div className='flex items-center gap-2 overflow-hidden truncate'>
            {brandLogo}
            <span className='text-lg font-bold text-green-600 truncate'>
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
            'p-1 text-gray-500 hover:text-gray-700',
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
      <div className='flex-1 overflow-y-auto p-2 space-y-3'>
        {normalizedCategories.map((cat, idx) => (
          <div key={cat.title || idx} className='space-y-1'>
            {cat.title && (
              <>
                {!isCollapsed ? (
                  <div className='px-3 pt-2 pb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-left'>
                    {cat.title}
                  </div>
                ) : (
                  idx > 0 && <div className='my-1 border-t border-gray-100' />
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
        <div className='border-t border-gray-100 p-3 flex items-center gap-3 overflow-hidden shrink-0'>
          <div className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 font-semibold text-xs shrink-0 overflow-hidden'>
            {userProfile.avatar || <UserIcon size={18} />}
          </div>
          {!isCollapsed && (
            <div className='flex flex-col truncate min-w-0 text-left'>
              <span className='text-xs font-semibold text-gray-800 truncate'>
                {userProfile.name}
              </span>
              {userProfile.subtitle && (
                <span className='text-[10px] text-gray-500 truncate'>
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
