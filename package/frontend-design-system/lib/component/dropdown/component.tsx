import { ChevronDown } from 'lucide-react'
import React, { memo } from 'react'

import { cn } from '../../theme'
import type { DropdownProps } from './type'
import { DropdownPropsEq } from './type'

export const DropdownComponent = ({
  triggerLabel,
  items,
  model,
  dispatch,
  className,
  key,
  dataTest,
}: DropdownProps): React.ReactElement => {
  const selectedItem = items.find((i) => i.id === model.selectedId)

  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Dropdown'
      className={cn('relative inline-block text-left', className)}
    >
      <button
        type='button'
        onClick={() => dispatch({ _tag: 'Toggle' })}
        className='inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900'
      >
        <span>{selectedItem ? selectedItem.label : triggerLabel}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-500 transition-transform dark:text-zinc-400',
            model.isOpen && 'rotate-180',
          )}
        />
      </button>

      {model.isOpen && (
        <div className='absolute left-0 z-50 mt-1.5 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-950'>
          {items.map((item, idx) =>
            item.isDivider ? (
              <div
                key={idx}
                className='my-1 border-t border-gray-100 dark:border-zinc-800'
              />
            ) : (
              <button
                key={item.id}
                type='button'
                onClick={() => dispatch({ _tag: 'Select', id: item.id })}
                className={cn(
                  'block w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400',
                  model.selectedId === item.id
                    ? 'bg-emerald-50/50 font-semibold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                    : 'text-gray-700 dark:text-zinc-300',
                )}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}

export const DropdownMemo = memo(DropdownComponent, DropdownPropsEq.equals)
