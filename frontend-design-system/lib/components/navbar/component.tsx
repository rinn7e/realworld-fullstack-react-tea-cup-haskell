import React from 'react'
import { Menu as MenuIcon, X as XIcon } from 'lucide-react'
import { cn } from '../../theme'
import type { NavbarItem, NavbarProps } from './type'

export const view: React.FC<NavbarProps> = ({
  brand,
  startItems = [],
  endItems = [],
  model,
  dispatch,
  onNavigate,
  className,
}) => {
  const renderItem = (item: NavbarItem) => {
    const isActive = model.activeId === item.id || item.isActive
    return (
      <a
        key={item.id}
        href={item.href || '#'}
        onClick={(e) => {
          if (onNavigate) {
            e.preventDefault()
            onNavigate(item.id)
          }
          dispatch({ _tag: 'SelectTab', id: item.id })
        }}
        className={cn(
          'block rounded-md px-3.5 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-emerald-50 font-semibold text-emerald-600'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        )}
      >
        {item.label}
      </a>
    )
  }

  return (
    <nav
      className={cn(
        'w-full border-b border-gray-200 bg-white shadow-2xs',
        className,
      )}
    >
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8'>
        {/* Brand */}
        <div className='flex items-center gap-8'>
          <div className='text-xl font-bold tracking-tight text-emerald-600'>
            {brand}
          </div>
          <div className='hidden items-center gap-1 sm:flex'>
            {startItems.map(renderItem)}
          </div>
        </div>

        {/* Desktop End Items */}
        <div className='hidden items-center gap-1 sm:flex'>
          {endItems.map(renderItem)}
        </div>

        {/* Mobile Burger Toggle */}
        <div className='flex sm:hidden'>
          <button
            type='button'
            onClick={() => dispatch({ _tag: 'ToggleBurger' })}
            className='inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none'
          >
            {model.isBurgerOpen ? (
              <XIcon className='h-6 w-6' />
            ) : (
              <MenuIcon className='h-6 w-6' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {model.isBurgerOpen && (
        <div className='space-y-1 border-t border-gray-100 px-4 pt-2 pb-4 sm:hidden animate-in slide-in-from-top-2'>
          {startItems.map(renderItem)}
          {endItems.map(renderItem)}
        </div>
      )}
    </nav>
  )
}

export const NavbarView = view
