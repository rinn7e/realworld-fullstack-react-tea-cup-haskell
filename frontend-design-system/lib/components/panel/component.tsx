import React from 'react'
import { cn } from '../../theme'
import type { PanelProps } from './type'

export const view = ({
  heading = 'Repositories',
  tabs = [],
  blocks = [],
  model,
  dispatch,
  className,
}: PanelProps): React.ReactElement => {
  return (
    <nav
      className={cn(
        'overflow-hidden rounded-xl border border-gray-200 bg-white text-sm shadow-xs',
        className,
      )}
    >
      <div className='border-b border-gray-100 bg-gray-50/50 px-5 py-3.5 font-bold text-gray-900'>
        {heading}
      </div>

      {tabs.length > 0 && (
        <div className='flex border-b border-gray-100 bg-gray-50/30 px-2'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type='button'
              onClick={() => dispatch({ _tag: 'SelectTab', id: tab.id })}
              className={cn(
                'cursor-pointer px-4 py-2.5 font-medium transition-colors border-b-2 -mb-px',
                model.activeTabId === tab.id
                  ? 'border-emerald-600 font-semibold text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className='divide-y divide-gray-100'>
        {blocks.map((item) => (
          <button
            key={item.id}
            type='button'
            onClick={() => dispatch({ _tag: 'SelectItem', id: item.id })}
            className={cn(
              'flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-gray-50',
              model.selectedItemId === item.id
                ? 'bg-emerald-50/50 font-semibold text-emerald-700'
                : 'text-gray-700',
            )}
          >
            {item.icon && <span className='shrink-0'>{item.icon}</span>}
            <span className='truncate'>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export const PanelView = view
