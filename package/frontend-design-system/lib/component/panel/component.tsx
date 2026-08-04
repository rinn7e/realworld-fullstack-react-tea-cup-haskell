import React, { memo } from 'react'

import { cn } from '../../theme'
import type { PanelProps } from './type'
import { PanelPropsEq } from './type'

export const PanelComponent = ({
  heading = 'Repositories',
  tabs = [],
  blocks = [],
  model,
  dispatch,
  className,
  key,
  dataTest,
}: PanelProps): React.ReactElement => {
  return (
    <nav
      key={key}
      data-test={dataTest}
      data-component='Panel'
      className={cn(
        'overflow-hidden rounded-xl border border-gray-200 bg-white text-sm shadow-xs dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100',
        className,
      )}
    >
      <div className='border-b border-gray-100 bg-gray-50/50 px-5 py-3.5 font-bold text-gray-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100'>
        {heading}
      </div>

      {tabs.length > 0 && (
        <div className='flex border-b border-gray-100 bg-gray-50/30 px-2 dark:border-zinc-800 dark:bg-zinc-900/50'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type='button'
              onClick={() => dispatch({ _tag: 'SelectTab', id: tab.id })}
              className={cn(
                '-mb-px cursor-pointer border-b-2 px-4 py-2.5 font-medium transition-colors',
                model.activeTabId === tab.id
                  ? 'border-emerald-600 font-semibold text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className='divide-y divide-gray-100 dark:divide-zinc-800'>
        {blocks.map((item) => (
          <button
            key={item.id}
            type='button'
            onClick={() => dispatch({ _tag: 'SelectItem', id: item.id })}
            className={cn(
              'flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-zinc-900',
              model.selectedItemId === item.id
                ? 'bg-emerald-50/50 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'text-gray-700 dark:text-zinc-300',
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

export const PanelMemo = memo(PanelComponent, PanelPropsEq.equals)
