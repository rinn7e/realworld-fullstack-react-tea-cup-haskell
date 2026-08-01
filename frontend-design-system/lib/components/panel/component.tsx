import React from 'react'
import { cn } from '../../theme'
import type { PanelProps } from './type'

export const view: React.FC<PanelProps> = ({
  heading,
  tabs = [],
  blocks = [],
  model,
  dispatch,
  className,
}) => {
  return (
    <nav
      className={cn(
        'overflow-hidden rounded-xl border border-gray-200 bg-white text-sm shadow-xs',
        className,
      )}
    >
      <p className='border-b border-gray-200 bg-gray-50 px-4 py-3 font-bold text-gray-900'>
        {heading}
      </p>

      {tabs.length > 0 && (
        <div className='flex border-b border-gray-200 bg-gray-50/50 text-xs font-semibold'>
          {tabs.map((tab) => {
            const isActive = model.activeTabId === tab.id
            return (
              <button
                key={tab.id}
                type='button'
                onClick={() => dispatch({ _tag: 'SelectTab', id: tab.id })}
                className={cn(
                  'flex-1 border-b-2 py-2.5 text-center transition-colors',
                  isActive
                    ? 'border-emerald-500 bg-white font-bold text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-900',
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      )}

      <div>
        {blocks.map((block) => {
          const isSelected = model.selectedItemId === block.id
          return (
            <button
              key={block.id}
              type='button'
              onClick={() => dispatch({ _tag: 'SelectItem', id: block.id })}
              className={cn(
                'flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-0 hover:bg-gray-50',
                isSelected && 'bg-emerald-50/60 font-semibold text-emerald-700',
              )}
            >
              {block.icon && <span className='text-gray-400'>{block.icon}</span>}
              <span>{block.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export const PanelView = view
