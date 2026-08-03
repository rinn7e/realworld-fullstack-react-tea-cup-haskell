import { X } from 'lucide-react'
import React, { memo } from 'react'
import { createPortal } from 'react-dom'

import { ButtonMemo as DsButtonMemo } from '../../element/button/component'
import { cn } from '../../theme'
import { GenericLink } from '../generic-link'

import type { SidebarProps } from './type'
import { SidebarPropsEq } from './type'

export const SidebarComponent: React.FC<SidebarProps> = ({
  model,
  items,
  dispatch,
  className,
  key,
  dataTest,
}) => {
  const state = model.status.state._tag
  const isVisible = state !== 'Invisible'

  if (!isVisible) {
    return null
  }

  const backdropCls = cn(
    'absolute inset-0 bg-black/50',
    state === 'AnimateIn' && 'animate-fade-in',
    state === 'AnimateOut' && 'animate-fade-out',
  )

  const sidebarCls = cn(
    'relative flex flex-col w-[280px] h-full bg-white shadow-xl p-[16px] overflow-y-auto',
    state === 'AnimateIn' && 'animate-slide-in',
    state === 'AnimateOut' && 'animate-slide-out',
    className,
  )

  const activeCls = 'text-green-600'
  const inactiveCls = 'text-gray-500 hover:text-gray-900'

  return createPortal(
    <div
      key={key}
      data-test={dataTest || 'sidebar'}
      className='absolute inset-0 z-[100] flex justify-end overflow-hidden'
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
              children={() => <X size={24} />}
            />
          </div>
          <ul className='flex flex-col gap-[8px]'>
            {items.map((item) => {
              const baseCls = item.icon
                ? 'flex items-center gap-[6px] rounded px-[12px] py-[6px] text-sm'
                : 'block rounded px-[12px] py-[6px] text-sm'

              return (
                <li key={item.key}>
                  <GenericLink
                    className={cn(
                      baseCls,
                      item.isActive ? activeCls : inactiveCls,
                    )}
                    href={item.href}
                    dispatch={dispatch}
                    msg={{ _tag: 'ClickItem', item }}
                    data-test='nav-link'
                    aria-current={item.isActive ? 'page' : undefined}
                  >
                    {item.icon}
                    {item.label}
                  </GenericLink>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export const SidebarMemo = memo(SidebarComponent, SidebarPropsEq.equals)
