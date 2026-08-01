import React from 'react'
import { cn } from '../../theme'
import type { TabsProps } from './type'

export const view: React.FC<TabsProps> = ({
  items,
  model,
  dispatch,
  isBoxed = false,
  isToggle = false,
  isFullWidth = false,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <ul
        className={cn(
          'flex items-center text-sm font-medium',
          !isToggle && 'border-b border-gray-200',
          isToggle && 'inline-flex rounded-lg bg-gray-100 p-1 text-gray-600',
          isFullWidth && 'w-full',
        )}
      >
        {items.map((tab) => {
          const isActive = model.activeId === tab.id
          return (
            <li key={tab.id} className={cn(isFullWidth && 'flex-1')}>
              <button
                type='button'
                onClick={() => dispatch({ _tag: 'Select', id: tab.id })}
                className={cn(
                  'inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 transition-all',
                  !isToggle &&
                    !isBoxed && [
                      '-mb-px border-b-2',
                      isActive
                        ? 'border-emerald-500 font-bold text-emerald-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    ],
                  isBoxed && [
                    'rounded-x border-t border-transparent',
                    isActive
                      ? 'border-gray-200 bg-white font-bold text-emerald-600 shadow-xs'
                      : 'text-gray-500 hover:text-gray-700',
                  ],
                  isToggle && [
                    'rounded-md text-xs font-semibold',
                    isActive
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900',
                  ],
                )}
              >
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const TabsView = view
