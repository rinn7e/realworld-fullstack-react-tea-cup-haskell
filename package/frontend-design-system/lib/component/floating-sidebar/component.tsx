import { cn } from '@rinn7e/tea-cup-prelude'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import React, { memo } from 'react'
import { createPortal } from 'react-dom'

import { ButtonMemo as DsButtonMemo } from '../../element/button/component'
import type { NavItemData } from '../../type/nav-item'
import { GenericLink } from '../generic-link'
import type { FloatingSidebarProps } from './type'
import { FloatingSidebarPropsEq } from './type'

export const FloatingSidebarComponent: React.FC<FloatingSidebarProps> = ({
  model,
  items,
  dispatch,
  placement = 'right',
  className,
  dataTest,
}) => {
  const state = model.status.state._tag
  const isVisible = state !== 'Invisible'

  if (!isVisible) {
    return null
  }

  const isLeft = placement === 'left'

  const backdropCls = cn(
    'fixed inset-0 bg-black/50 dark:bg-zinc-950/80',
    state === 'AnimateIn' && 'animate-fade-in',
    state === 'AnimateOut' && 'animate-fade-out',
  )

  const slideInCls = isLeft ? 'animate-slide-in-left' : 'animate-slide-in'
  const slideOutCls = isLeft ? 'animate-slide-out-left' : 'animate-slide-out'

  const sidebarCls = cn(
    'relative flex flex-col w-[280px] h-full bg-white dark:bg-zinc-900 shadow-2xl p-[16px] overflow-y-auto',
    state === 'AnimateIn' && slideInCls,
    state === 'AnimateOut' && slideOutCls,
    className,
  )

  const activeCls = 'text-green-600 font-semibold'
  const inactiveCls =
    'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100'

  const renderFloatingItem = (item: NavItemData, depth = 0) => {
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

    const baseCls = item.icon
      ? 'flex items-center gap-[6px] rounded px-[12px] py-[6px] text-sm'
      : 'block rounded px-[12px] py-[6px] text-sm'

    return (
      <li key={item.key} className='space-y-1'>
        <GenericLink
          className={cn(
            baseCls,
            'flex cursor-pointer items-center justify-between select-none',
            item.isActive ? activeCls : inactiveCls,
            depth > 0 && 'pl-7 text-xs',
          )}
          href={hasChildren ? undefined : item.href}
          onClick={handleClick}
          dispatch={dispatch}
          msg={hasChildren ? undefined : { _tag: 'ClickItem', item }}
          data-test='nav-link'
          aria-current={item.isActive ? 'page' : undefined}
        >
          <div className='flex items-center gap-[6px] truncate'>
            {item.icon}
            <span>{item.label}</span>
          </div>

          {hasChildren && (
            <span className='shrink-0 text-gray-400 dark:text-zinc-500'>
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </span>
          )}
        </GenericLink>

        {hasChildren && isExpanded && (
          <ul className='ml-3 flex flex-col gap-1 border-l border-gray-100 pl-2 dark:border-zinc-800'>
            {item.children!.map((child) =>
              renderFloatingItem(child, depth + 1),
            )}
          </ul>
        )}
      </li>
    )
  }

  return createPortal(
    <div
      data-test={dataTest || 'floating-sidebar'}
      data-component='FloatingSidebar'
      className={cn(
        'fixed inset-0 z-[100] flex overflow-hidden',
        isLeft ? 'justify-start' : 'justify-end',
      )}
    >
      {/* backdrop */}
      <div
        className={backdropCls}
        onClick={() => dispatch({ _tag: 'Toggle', open: false })}
      />
      {/* sidebar content */}
      <div className={sidebarCls}>
        <div className='flex flex-col gap-[16px]'>
          <div className='flex items-center justify-between'>
            <span className='text-xl font-bold text-green-600'>conduit</span>
            <DsButtonMemo
              color='gray'
              variant='ghost'
              onClick={() => dispatch({ _tag: 'Toggle', open: false })}
              className='p-[8px]'
            >
              <X size={24} />
            </DsButtonMemo>
          </div>
          <ul className='flex flex-col gap-[8px]'>
            {items.map((item) => renderFloatingItem(item))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export const FloatingSidebarMemo = memo(
  FloatingSidebarComponent,
  FloatingSidebarPropsEq.equals,
)
