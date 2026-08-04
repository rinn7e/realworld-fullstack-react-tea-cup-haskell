import React, { memo } from 'react'

import { cn } from '../../theme'
import type { PopoverProps } from './type'
import { PopoverPropsEq } from './type'

export const PopoverComponent: React.FC<PopoverProps> = ({
  model,
  dispatch,
  trigger,
  children,
  align = 'left',
  className,
  cardClassName,
  dataTest,
}) => {
  return (
    <div
      data-test={dataTest}
      data-component='Popover'
      className={cn('relative inline-block', className)}
    >
      <div
        onClick={() => dispatch({ _tag: 'Toggle' })}
        className='inline-block cursor-pointer'
      >
        {trigger}
      </div>

      {model.isOpen && (
        <>
          <div
            className='fixed inset-0 z-40'
            onClick={() => dispatch({ _tag: 'Close' })}
          />
          <div
            className={cn(
              'absolute top-full z-50 mt-2 w-44 rounded-lg border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-2xl',
              align === 'right' ? 'right-0' : 'left-0',
              cardClassName,
            )}
          >
            {children}
          </div>
        </>
      )}
    </div>
  )
}

export const PopoverMemo = memo(PopoverComponent, PopoverPropsEq.equals)
