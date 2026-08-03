import { FloatingSidebarMemo as DsFloatingSidebarMemo } from '@rinn7e/realworld-design-system/component/floating-sidebar/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import type { NavItemData as DsNavItemData } from '@rinn7e/realworld-design-system/type/nav-item'
import { Code2, Home, Pencil, Settings, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const FloatingSidebarPage: React.FC<Props> = ({ model, dispatch }) => {
  const items: DsNavItemData[] = [
    {
      key: 'home',
      label: 'Home',
      href: '#',
      isActive: true,
      icon: <Home size={14} />,
    },
    {
      key: 'editor',
      label: 'New Article',
      href: '#',
      isActive: false,
      icon: <Pencil size={14} />,
    },
    {
      key: 'settings',
      label: 'Settings',
      href: '#',
      isActive: false,
      icon: <Settings size={14} />,
    },
  ]

  const code = `const [sidebarModel, sidebarCmd] = DsFloatingSidebar.init()

<DsButtonMemo onClick={() => dispatch({ _tag: 'OpenSidebar' })}>
  Open Sidebar
</DsButtonMemo>

<DsFloatingSidebarMemo
  model={model.sidebar}
  items={items}
  placement="${model.placement}"
  dispatch={(subMsg) => dispatch({ _tag: 'SidebarMsg', subMsg })}
/>`

  return (
    <div data-component='FloatingSidebarPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        variant='default'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6'
        children={() => (
          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              COMPONENTS / FLOATING SIDEBAR
            </div>
            <DsTitleMemo
              size={2}
              className='mb-2 font-extrabold text-gray-900'
              children={() => 'Floating Sidebar'}
            />
            <p className='text-base text-gray-600'>
              Slide-over mobile navigation drawer supporting left or right side placements with animated backdrop and item links.
            </p>
          </>
        )}
      />

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <DsTitleMemo
            size={5}
            className='flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600'
            children={() => (
              <>
                <Sparkles className='h-4 w-4 text-green-600' />
                <span>Interactive Drawer Demo</span>
              </>
            )}
          />
          <DsButtonMemo
            color='green'
            variant='link'
            size='small'
            onClick={() => dispatch({ _tag: 'ToggleShowCode' })}
            className='flex items-center gap-1 font-semibold text-green-600 hover:underline'
            children={() => (
              <>
                <Code2 className='h-3.5 w-3.5' />
                <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
              </>
            )}
          />
        </div>

        {sectionView({
          title: 'Slide-Over Navigation Drawer',
          boxClassName:
            'p-6 w-full bg-white border-2 border-dotted border-gray-300 rounded-lg flex flex-col items-start gap-4',
          children: () => (
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-3'>
                <span className='text-sm font-medium text-gray-700'>
                  Placement:
                </span>
                <button
                  type='button'
                  onClick={() =>
                    dispatch({ _tag: 'SetPlacement', placement: 'left' })
                  }
                  className={`px-3 py-1 text-xs rounded border transition-colors ${
                    model.placement === 'left'
                      ? 'border-green-600 bg-green-50 text-green-700 font-bold'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Left
                </button>
                <button
                  type='button'
                  onClick={() =>
                    dispatch({ _tag: 'SetPlacement', placement: 'right' })
                  }
                  className={`px-3 py-1 text-xs rounded border transition-colors ${
                    model.placement === 'right'
                      ? 'border-green-600 bg-green-50 text-green-700 font-bold'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Right
                </button>
              </div>

              <DsButtonMemo
                color='green'
                variant='solid'
                onClick={() => dispatch({ _tag: 'OpenSidebar' })}
                children={() =>
                  `Open ${model.placement === 'left' ? 'Left' : 'Right'} Floating Sidebar`
                }
              />

              <DsFloatingSidebarMemo
                model={model.sidebar}
                items={items}
                placement={model.placement}
                dispatch={(subMsg) => dispatch({ _tag: 'SidebarMsg', subMsg })}
              />
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Floating Sidebar Component Code</span>
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
