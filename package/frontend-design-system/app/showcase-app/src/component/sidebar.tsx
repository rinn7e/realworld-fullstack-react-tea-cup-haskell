import { BoxMemo } from '@rinn7e/realworld-design-system/element/box/component'
import * as Menu from '@rinn7e/realworld-design-system/component/menu'
import { MenuMemo } from '@rinn7e/realworld-design-system/component/menu/component'
import React from 'react'

import type { AppRoute } from '../route/type'

export interface SidebarProps {
  menuCategories: Menu.MenuCategory[]
  menuModel: Menu.Model
  navigateRoute: (route: AppRoute) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  menuCategories,
  menuModel,
  navigateRoute,
}) => {
  return (
    <div data-component='ShowcaseSidebar' className='w-full'>
      <BoxMemo
        className='p-4 w-full text-left bg-gray-50/50 border border-gray-200/80 rounded-lg'
        children={() => (
          <MenuMemo
            categories={menuCategories}
            model={menuModel}
            dispatch={(subMsg: Menu.Msg) => {
              if (subMsg._tag === 'Select') {
                const compId = subMsg.id as string
                const pageTagName =
                  compId
                    .split('-')
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join('') + 'Page'
                navigateRoute({
                  page: { _tag: pageTagName } as unknown as AppRoute['page'],
                })
              }
            }}
          />
        )}
      />
    </div>
  )
}
