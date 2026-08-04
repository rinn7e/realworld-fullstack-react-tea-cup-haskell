import * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import { NavbarMemo as DsNavbarMemo } from '@rinn7e/realworld-design-system/component/navbar/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { Code2, Menu, Pencil, Settings, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const NavbarPage: React.FC<Props> = ({ model, dispatch }) => {
  const navbarConfig: DsNavbar.Config = {
    brandNavItem: {
      key: 'brand',
      label: 'conduit',
      href: '#',
      isActive: false,
    },
    desktopNavItems: [
      {
        key: 'home',
        label: 'Home',
        href: '#',
        isActive: true,
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
    ],
    mobileNavItems: [
      {
        key: 'menu',
        label: '',
        href: '#',
        isActive: false,
        icon: <Menu size={24} />,
      },
    ],
  }

  const code = `const navbarConfig: DsNavbar.Config = {
  brandNavItem: {
    key: 'site-logo',
    label: 'conduit',
    href: '/',
    isActive: false,
  },
  desktopNavItems: [
    {
      key: 'home',
      label: 'Home',
      href: '/',
      isActive: true,
    },
  ],
}`

  return (
    <div data-component='NavbarPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        variant='default'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <>
          <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            COMPONENTS / NAVBAR
          </div>
          <DsTitleMemo
            size={2}
            className='mb-2 font-extrabold text-gray-900 dark:text-zinc-100'
          >
            Navbar
          </DsTitleMemo>
          <p className='text-base text-gray-600 dark:text-zinc-400'>
            Top navigation header with brand, desktop links, and mobile items.
          </p>
        </>
      </DsHeroMemo>

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <DsTitleMemo
            size={5}
            className='flex items-center gap-2 font-bold tracking-wider text-gray-600 uppercase dark:text-zinc-400'
          >
            <>
              <Sparkles className='h-4 w-4 text-green-600' />
              <span>Interactive Playground &amp; Code</span>
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
          title: 'Top Navigation Header',
          boxClassName:
            'px-0 pt-0 pb-6 w-full bg-white border-2 border-dotted border-gray-300 dark:bg-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg overflow-hidden',
          children: () => (
            <DsNavbarMemo
              config={navbarConfig}
              dispatch={(subMsg) => dispatch({ _tag: 'NavbarMsg', subMsg })}
            />
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Navbar Component Code
              </span>
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
