import React from 'react'

import { cn } from '../../theme'
import type { TabsProps } from './type'

export const view = ({
  items,
  isBoxed = false,
  isToggle = false,
  model,
  dispatch,
  className,
}: TabsProps): React.ReactElement => {
  return (
    <div
      data-component='Tabs'
      className={cn(
        'border-b border-gray-200 text-sm font-medium text-gray-500',
        className,
      )}
    >
      <ul className='-mb-px flex flex-wrap gap-2'>
        {items.map((item) => {
          const isActive = model.activeId === item.id
          if (isBoxed) {
            return (
              <li key={item.id}>
                <button
                  type='button'
                  onClick={() => dispatch({ _tag: 'Select', id: item.id })}
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-2 rounded-t-lg border border-b-0 px-4 py-2.5 transition-colors',
                    isActive
                      ? 'border-gray-200 bg-white font-semibold text-emerald-600 shadow-2xs'
                      : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            )
          }

          if (isToggle) {
            return (
              <li key={item.id}>
                <button
                  type='button'
                  onClick={() => dispatch({ _tag: 'Select', id: item.id })}
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 transition-colors',
                    isActive
                      ? 'bg-emerald-600 font-semibold text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            )
          }

          return (
            <li key={item.id}>
              <button
                type='button'
                onClick={() => dispatch({ _tag: 'Select', id: item.id })}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2 border-b-2 px-4 py-2.5 transition-colors',
                  isActive
                    ? 'border-emerald-600 font-bold text-emerald-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const TabsView = view
