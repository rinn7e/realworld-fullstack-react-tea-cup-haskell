import * as Navbar from '@rinn7e/realworld-design-system/component/navbar'
import { NavbarMemo } from '@rinn7e/realworld-design-system/component/navbar/component'
import * as Button from '@rinn7e/realworld-design-system/element/button/view'
import * as Hero from '@rinn7e/realworld-design-system/layout/hero/view'
import * as Title from '@rinn7e/realworld-design-system/element/title/view'
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
  const navbarConfig: Navbar.Config<string> = {
    brandNavItem: {
      key: 'brand',
      label: 'conduit',
      href: '#',
      isActive: false,
      onClick: 'nav:brand',
    },
    desktopNavItems: [
      {
        key: 'home',
        label: 'Home',
        href: '#',
        isActive: true,
        onClick: 'nav:home',
      },
      {
        key: 'editor',
        label: 'New Article',
        href: '#',
        isActive: false,
        onClick: 'nav:editor',
        icon: <Pencil size={14} />,
      },
      {
        key: 'settings',
        label: 'Settings',
        href: '#',
        isActive: false,
        onClick: 'nav:settings',
        icon: <Settings size={14} />,
      },
    ],
    mobileNavItems: [
      {
        key: 'menu',
        label: '',
        href: '#',
        isActive: false,
        onClick: 'nav:mobile-menu',
        icon: <Menu size={24} />,
      },
    ],
  }

  const code = `const navbarConfig: Navbar.Config<Msg> = {
  brandNavItem: {
    key: 'site-logo',
    label: 'conduit',
    href: '/',
    isActive: false,
    onClick: { _tag: 'ChangeRoute', route: homeRoute },
  },
  desktopNavItems: [
    {
      key: 'home',
      label: 'Home',
      href: '/',
      isActive: true,
      onClick: { _tag: 'ChangeRoute', route: homeRoute },
    },
    {
      key: 'editor',
      label: 'New Article',
      href: '/editor',
      isActive: false,
      onClick: { _tag: 'ChangeRoute', route: editorRoute },
      icon: <Pencil size={14} />,
    },
    {
      key: 'settings',
      label: 'Settings',
      href: '/settings',
      isActive: false,
      onClick: { _tag: 'ChangeRoute', route: settingsRoute },
      icon: <Settings size={14} />,
    },
  ],
  mobileNavItems: [
    {
      key: 'toggle-sidebar',
      label: '',
      href: '',
      isActive: false,
      onClick: { _tag: 'ToggleSidebar' },
      icon: <Menu size={24} />,
    },
  ],
}

<Navbar.NavbarMemo
  config={navbarConfig}
  dispatch={dispatch}
/>`

  return (
    <div data-component='NavbarPage' className='w-full space-y-8 text-left'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className:
          'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: () => (
          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              COMPONENTS / NAVBAR
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: () => 'Navbar',
            })}
            <p className='text-base text-gray-600'>
              Top navigation header with brand, desktop links, and mobile items.
            </p>
          </>
        ),
      })}

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          {Title.view({
            size: 5,
            className:
              'flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600',
            children: () => (
              <>
                <Sparkles className='h-4 w-4 text-green-600' />
                <span>Interactive Playground &amp; Code</span>
              </>
            ),
          })}
          {Button.view({
            color: 'green',
            variant: 'link',
            size: 'small',
            onClick: () => dispatch({ _tag: 'ToggleShowCode' }),
            className:
              'flex items-center gap-1 font-semibold text-green-600 hover:underline',
            children: () => (
              <>
                <Code2 className='h-3.5 w-3.5' />
                <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
              </>
            ),
          })}
        </div>

        {sectionView({
          title: 'Top Navigation Header',
          boxClassName:
            'px-0 pt-0 pb-6 w-full bg-white border-2 border-dotted border-gray-300 rounded-lg overflow-hidden',
          children: () => (
            <NavbarMemo
              config={navbarConfig}
              dispatch={(msg: string) => dispatch({ _tag: 'NavbarMsg', msg })}
            />
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Navbar Component Code</span>
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
