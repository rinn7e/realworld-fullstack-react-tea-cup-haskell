import { SidebarMemo as DsSidebarMemo } from '@rinn7e/realworld-design-system/component/sidebar/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import type { NavItemData as DsNavItemData } from '@rinn7e/realworld-design-system/type/nav-item'
import {
  Code2,
  Gem,
  Image,
  Library,
  Pencil,
  Search,
  Sparkles,
  Video,
} from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const SidebarPage: React.FC<Props> = ({ model, dispatch }) => {
  const items: DsNavItemData[] = [
    {
      key: 'new-chat',
      label: 'New chat',
      href: '#',
      isActive: true,
      icon: <Pencil size={18} />,
    },
    {
      key: 'search',
      label: 'Search chats',
      href: '#',
      isActive: false,
      icon: <Search size={18} />,
    },
    {
      key: 'images',
      label: 'Images',
      href: '#',
      isActive: false,
      icon: <Image size={18} />,
    },
    {
      key: 'videos',
      label: 'Videos',
      href: '#',
      isActive: false,
      icon: <Video size={18} />,
    },
    {
      key: 'library',
      label: 'Library',
      href: '#',
      isActive: false,
      icon: <Library size={18} />,
    },
    {
      key: 'gems',
      label: 'Gems',
      href: '#',
      isActive: false,
      icon: <Gem size={18} />,
    },
  ]

  const code = `const [sidebarModel, sidebarCmd] = DsSidebar.init(false)

<DsSidebarMemo
  model={model.sidebar}
  items={items}
  brandTitle="Gemini"
  userProfile={{
    name: 'Moremi Vannak',
    subtitle: 'Ultra',
  }}
  dispatch={(subMsg) => dispatch({ _tag: 'SidebarMsg', subMsg })}
/>`

  return (
    <div data-component='SidebarPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        variant='default'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6'>

          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              COMPONENTS / SIDEBAR
            </div>
            <DsTitleMemo
              size={2}
              className='mb-2 font-extrabold text-gray-900'>Sidebar</DsTitleMemo>
            <p className='text-base text-gray-600'>
              In-DOM collapsible vertical navigation sidebar layout component.
            </p>
          </>
        
</DsHeroMemo>

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <DsTitleMemo
            size={5}
            className='flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600'>
              <>
                <Sparkles className='h-4 w-4 text-green-600' />
                <span>In-DOM Collapsible Sidebar Layout</span>
              </>
            </DsTitleMemo>
          <DsButtonMemo
            color='green'
            variant='link'
            size='small'
            onClick={() => dispatch({ _tag: 'ToggleShowCode' })}
            className='flex items-center gap-1 font-semibold text-green-600 hover:underline'
          >
            <Code2 className='h-3.5 w-3.5' />
            <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
          </DsButtonMemo>
        </div>

        {sectionView({
          title: 'Collapsible In-DOM Sidebar Demo',
          boxClassName:
            'p-0 w-full bg-gray-50 border-2 border-dotted border-gray-300 rounded-lg overflow-hidden h-[450px] flex',
          children: () => (
            <div className='flex w-full h-full'>
              <DsSidebarMemo
                model={model.sidebar}
                items={items}
                brandTitle='Gemini'
                userProfile={{
                  name: 'Moremi Vannak',
                  subtitle: 'Ultra',
                }}
                dispatch={(subMsg) => dispatch({ _tag: 'SidebarMsg', subMsg })}
              />
              <div className='flex-1 p-6 bg-white overflow-y-auto'>
                <h4 className='text-base font-bold text-gray-800 mb-2'>
                  Main Content Area
                </h4>
                <p className='text-sm text-gray-600 leading-relaxed'>
                  Notice how the sidebar occupies layout DOM space alongside this main content area. Toggle the sidebar collapse button in the header to collapse/expand!
                </p>
              </div>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Sidebar Component Code</span>
            </div>
            <pre className='font-mono text-xs leading-relaxed whitespace-pre-wrap text-gray-300'>
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
