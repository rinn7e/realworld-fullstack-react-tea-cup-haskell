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
  key,
  dataTest,
}: NavbarProps): React.ReactElement => {
  return (
    <nav
      key={key}
      data-test={dataTest}
      data-component='Navbar'
      className={cn(
        'sticky top-0 z-20 border-b border-gray-100 bg-white shadow-sm',
        className,
      )}
    >
      <div className='mx-auto max-w-[1152px] px-[16px]'>
        <div className='flex h-[56px] items-center justify-between'>
          <div className='flex items-center gap-[16px]'>
            <div className='flex items-center text-xl font-bold tracking-tight text-green-600'>
              {brand}
            </div>

            {startItems.length > 0 && (
              <div className='hidden items-center gap-[4px] md:flex'>
                {startItems.map((item) => {
                  const isActive = item.isActive ?? model.activeId === item.id
                  return (
                    <button
                      key={item.id}
                      type='button'
                      onClick={() =>
                        dispatch({ _tag: 'SelectTab', id: item.id })
                      }
                      className={cn(
                        'flex cursor-pointer items-center gap-[4px] rounded px-[12px] py-[6px] text-sm transition-colors',
                        isActive
                          ? 'text-green-600'
                          : 'text-gray-500 hover:text-gray-900',
                      )}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {endItems.length > 0 && (
            <div className='hidden items-center gap-[4px] md:flex'>
              {endItems.map((item) => {
                const isActive = item.isActive ?? model.activeId === item.id
                return (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => dispatch({ _tag: 'SelectTab', id: item.id })}
                    className={cn(
                      'flex cursor-pointer items-center gap-[4px] rounded px-[12px] py-[6px] text-sm transition-colors',
                      isActive
                        ? 'text-green-600'
                        : 'text-gray-500 hover:text-gray-900',
                    )}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          )}

          <div className='flex md:hidden'>
            <button
              type='button'
              onClick={() => dispatch({ _tag: 'ToggleBurger' })}
              className='cursor-pointer rounded p-[8px] text-gray-500 hover:text-gray-900'
            >
              {model.isBurgerOpen ? (
                <X className='h-[24px] w-[24px]' />
              ) : (
                <Menu className='h-[24px] w-[24px]' />
              )}
            </button>
          </div>
        </div>
      </div>

      {model.isBurgerOpen && (
        <div className='space-y-1 border-t border-gray-100 p-[16px] md:hidden'>
          {startItems.map((item) => {
            const isActive = item.isActive ?? model.activeId === item.id
            return (
              <button
                key={item.id}
                type='button'
                onClick={() => dispatch({ _tag: 'SelectTab', id: item.id })}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-[4px] rounded px-[12px] py-[6px] text-left text-sm transition-colors',
                  isActive
                    ? 'text-green-600'
                    : 'text-gray-500 hover:text-gray-900',
                )}
              >
                {item.label}
              </button>
            )
          })}
          {endItems.map((item) => {
            const isActive = item.isActive ?? model.activeId === item.id
            return (
              <button
                key={item.id}
                type='button'
                onClick={() => dispatch({ _tag: 'SelectTab', id: item.id })}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-[4px] rounded px-[12px] py-[6px] text-left text-sm transition-colors',
                  isActive
                    ? 'text-green-600'
                    : 'text-gray-500 hover:text-gray-900',
                )}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </nav>
  )
}
