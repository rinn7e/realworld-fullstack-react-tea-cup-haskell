import * as DsMenu from '@rinn7e/realworld-design-system/component/menu'
import { MenuMemo as DsMenuMemo } from '@rinn7e/realworld-design-system/component/menu/component'
import { BoxMemo as DsBoxMemo } from '@rinn7e/realworld-design-system/element/box/component'
import React from 'react'

import type { AppRoute } from '../route/type'

export interface SidebarProps {
  menuCategories: DsMenu.MenuCategory[]
  menuModel: DsMenu.Model
  navigateRoute: (route: AppRoute) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  menuCategories,
  menuModel,
  navigateRoute,
}) => {
  return (
    <div data-component='ShowcaseSidebar' className='w-full'>
      <DsBoxMemo
        className='w-full border border-gray-200/80 bg-gray-50/50 p-4 text-left rounded-lg'
        children={() => (
          <DsMenuMemo
            categories={menuCategories}
            model={menuModel}
            dispatch={(subMsg: DsMenu.Msg) => {
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
