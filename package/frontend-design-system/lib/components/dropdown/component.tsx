import { ChevronDown } from 'lucide-react'
import React from 'react'

import { cn } from '../../theme'
import type { DropdownProps } from './type'

export const view = ({
  triggerLabel,
  items,
  model,
  dispatch,
  className,
}: DropdownProps): React.ReactElement => {
  const selectedItem = items.find((i) => i.id === model.selectedId)

  return (
    <div
      data-component='Dropdown'
      className={cn('relative inline-block text-left', className)}
    >
      <button
        type='button'
        onClick={() => dispatch({ _tag: 'Toggle' })}
        className='inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none'
      >
        <span>{selectedItem ? selectedItem.label : triggerLabel}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-500 transition-transform',
            model.isOpen && 'rotate-180',
          )}
        />
      </button>

      {model.isOpen && (
        <div className='absolute left-0 z-50 mt-1.5 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5'>
          {items.map((item, idx) =>
            item.isDivider ? (
              <div key={idx} className='my-1 border-t border-gray-100' />
            ) : (
              <button
                key={item.id}
                type='button'
                onClick={() => dispatch({ _tag: 'Select', id: item.id })}
                className={cn(
                  'block w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors hover:bg-emerald-50 hover:text-emerald-700',
                  model.selectedId === item.id
                    ? 'bg-emerald-50/50 font-semibold text-emerald-600'
                    : 'text-gray-700',
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

export const DropdownView = view
