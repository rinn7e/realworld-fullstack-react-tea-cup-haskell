import { Button } from '@rinn7e/realworld-design-system'
import { cn } from '@rinn7e/tea-cup-prelude'
import { Menu } from 'lucide-react'
import React from 'react'

import { homePage } from '@/common/type/route'
import { memoStrategy } from '@/common/util'
import { Link } from '@/component/link'
import type { SidebarItemData } from '@/component/sidebar'

import type { Props } from './type'
import { PropsEq } from './type'

export const NavLinks: React.FC<{ items: SidebarItemData[] }> = ({ items }) => {
  const activeCls = 'text-green-600'
  const inactiveCls = 'text-gray-500 hover:text-gray-900'

  return (
    <>
      {items.map((item) => {
        const baseCls = item.icon
          ? 'flex items-center gap-[4px] rounded px-[12px] py-[6px] text-sm'
          : 'block rounded px-[12px] py-[6px] text-sm'

        return (
          <li key={item.key}>
            <Link
              className={cn(baseCls, item.isActive ? activeCls : inactiveCls)}
              route={item.route}
              data-test='nav-link'
              aria-current={item.isActive ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        )
      })}
    </>
  )
}

export const NavbarComponent: React.FC<Props> = ({
  items,
  unavailableMode,
  onToggleSidebar,
}) => {
  return (
    <nav
      className='sticky top-0 z-20 border-b border-gray-100 bg-white shadow-sm'
      data-test='navbar'
    >
      <div className='mx-auto max-w-[1152px] px-[16px]'>
        <div className='flex h-[56px] items-center justify-between'>
          <Link
            className='text-xl font-bold tracking-tight text-green-600'
            route={{ page: homePage() }}
            data-test='site-logo'
          >
            conduit
          </Link>

          {unavailableMode && (
            <span
              className='ml-[16px] flex items-center gap-[6px] text-sm text-gray-400'
              data-test='app-connecting-state'
            >
              <div className='h-[8px] w-[8px] animate-pulse rounded-full bg-amber-400' />
              Connecting
            </span>
          )}

          {/* mobile hamburger button */}
          {Button.view({
            color: 'gray',
            variant: 'ghost',
            onClick: () => onToggleSidebar?.(),
            className: 'p-[8px] lg:hidden',
            children: () => <Menu size={24} />,
          })}

          {/* desktop nav links */}
          <ul className='hidden lg:flex lg:items-center lg:gap-[4px]'>
            <NavLinks items={items} />
          </ul>
        </div>
      </div>
    </nav>
  )
}

export const NavbarMemo = memoStrategy(NavbarComponent, PropsEq.equals)
export const Navbar = NavbarComponent
