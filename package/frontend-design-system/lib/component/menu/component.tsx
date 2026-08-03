import React, { memo } from 'react'

import { cn } from '../../theme'
import type { MenuProps } from './type'
import { MenuPropsEq } from './type'

export const MenuComponent = ({
  categories,
  model,
  dispatch,
  className,
  key,
  dataTest,
}: MenuProps): React.ReactElement => {
  return (
    <aside
      key={key}
      data-test={dataTest}
      data-component='Menu'
      className={cn('w-full text-sm', className)}
    >
      {categories.map((cat, idx) => (
        <div key={idx} className='mb-4 last:mb-0'>
          <p className='mb-2 px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase'>
            {cat.title}
          </p>
          <ul className='space-y-1'>
            {cat.items.map((item) => {
              const isActive = model.activeId === item.id || item.isActive
              return (
                <li key={item.id}>
                  <button
                    type='button'
                    onClick={() => dispatch({ _tag: 'Select', id: item.id })}
                    className={cn(
                      'block w-full cursor-pointer rounded-md px-3 py-1.5 text-left font-medium transition-colors',
                      isActive
                        ? 'bg-green-600 font-semibold text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </aside>
  )
}

export const MenuMemo = memo(MenuComponent, MenuPropsEq.equals)
