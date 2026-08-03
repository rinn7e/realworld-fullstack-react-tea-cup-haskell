import { Button } from '@rinn7e/realworld-design-system'
import { cn } from '@rinn7e/tea-cup-prelude'
import { X } from 'lucide-react'
import React from 'react'
import { createPortal } from 'react-dom'
import type { Dispatcher } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
  children?: React.ReactNode
}

export const SidebarComponent: React.FC<Props> = ({
  model,
  dispatch,
  children,
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
  )

  return createPortal(
    <div className='absolute inset-0 z-[100] flex justify-end overflow-hidden'>
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
            {Button.view({
              color: 'gray',
              variant: 'ghost',
              onClick: () => dispatch({ _tag: 'Toggle', open: false }),
              className: 'p-[8px]',
              children: () => <X size={24} />,
            })}
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
