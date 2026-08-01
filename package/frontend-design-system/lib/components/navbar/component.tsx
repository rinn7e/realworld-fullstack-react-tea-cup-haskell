import { Menu, X } from 'lucide-react'
import React from 'react'

import { cn } from '../../theme'
import type { NavbarProps } from './type'

export const view = ({
  brand,
  startItems = [],
  endItems = [],
  model,
  dispatch,
  className,
}: NavbarProps): React.ReactElement => {
  return (
    <nav
      data-component='Navbar'
      className={cn(
        'relative border-b border-gray-100 bg-white px-4 py-3 shadow-2xs sm:px-6 lg:px-8',
        className,
      )}
    >
      <div className='mx-auto flex max-w-7xl items-center justify-between'>
        <div className='flex items-center gap-8'>
          <div className='flex items-center font-bold text-gray-900'>
            {brand}
          </div>

          <div className='hidden items-center gap-1 md:flex'>
            {startItems.map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => dispatch({ _tag: 'SelectTab', id: item.id })}
                className={cn(
                  'cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  model.activeId === item.id
                    ? 'bg-emerald-50 font-semibold text-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className='hidden items-center gap-3 md:flex'>
          {endItems.map((item) => (
            <div key={item.id}>{item.label}</div>
          ))}
        </div>

        <div className='flex md:hidden'>
          <button
            type='button'
            onClick={() => dispatch({ _tag: 'ToggleBurger' })}
            className='cursor-pointer rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          >
            {model.isBurgerOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
        </div>
      </div>

      {model.isBurgerOpen && (
        <div className='mt-3 space-y-1 border-t border-gray-100 pt-3 md:hidden'>
          {startItems.map((item) => (
            <button
              key={item.id}
              type='button'
              onClick={() => dispatch({ _tag: 'SelectTab', id: item.id })}
              className={cn(
                'block w-full cursor-pointer rounded-md px-3 py-2 text-left text-base font-medium',
                model.activeId === item.id
                  ? 'bg-emerald-50 font-semibold text-emerald-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              {item.label}
            </button>
          ))}
          <div className='space-y-2 pt-2'>
            {endItems.map((item) => (
              <div key={item.id} className='px-3 py-1'>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export const NavbarView = view
