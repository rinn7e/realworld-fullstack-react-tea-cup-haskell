import { Button, Hero, Navbar, Title } from '@rinn7e/realworld-design-system'
import { Code2, Pencil, Settings, Sparkles, UserCircle2 } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}
export const NavbarPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `{Navbar.view({
  brand: (
    <span className='text-xl font-bold tracking-tight text-green-600'>
      conduit
    </span>
  ),
  endItems: [
    { id: 'home', label: 'Home' },
    {
      id: 'editor',
      label: (
        <span className='flex items-center gap-[4px]'>
          <Pencil size={14} />
          <span>New Article</span>
        </span>
      ),
    },
    {
      id: 'settings',
      label: (
        <span className='flex items-center gap-[4px]'>
          <Settings size={14} />
          <span>Settings</span>
        </span>
      ),
    },
    {
      id: 'profile',
      label: (
        <span className='flex items-center gap-[8px]'>
          <UserCircle2 size={26} className='text-gray-300' />
          <span>admin</span>
        </span>
      ),
    },
  ],
  model: model.navbarModel,
  dispatch: (subMsg) => dispatch({ _tag: 'NavbarMsg', subMsg }),
})}`
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
              Top navigation bar with brand, links, and responsive hamburger
              mobile menu controls.
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
          children: () =>
            Navbar.view({
                brand: (
                  <span className='text-xl font-bold tracking-tight text-green-600'>
                    conduit
                  </span>
                ),
                endItems: [
                  { id: 'home', label: 'Home' },
                  {
                    id: 'editor',
                    label: (
                      <span className='flex items-center gap-[4px]'>
                        <Pencil size={14} />
                        <span>New Article</span>
                      </span>
                    ),
                  },
                  {
                    id: 'settings',
                    label: (
                      <span className='flex items-center gap-[4px]'>
                        <Settings size={14} />
                        <span>Settings</span>
                      </span>
                    ),
                  },
                  {
                    id: 'profile',
                    label: (
                      <span className='flex items-center gap-[8px]'>
                        <UserCircle2 size={26} className='text-gray-300' />
                        <span>admin</span>
                      </span>
                    ),
                  },
                ],
                model: model.navbarModel,
                dispatch: (subMsg) => dispatch({ _tag: 'NavbarMsg', subMsg }),
              }),
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
