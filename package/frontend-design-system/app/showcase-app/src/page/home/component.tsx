import { CardMemo as DsCardMemo } from '@rinn7e/realworld-design-system/component/card/component'
import { BoxMemo as DsBoxMemo } from '@rinn7e/realworld-design-system/element/box/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { ContentMemo as DsContentMemo } from '@rinn7e/realworld-design-system/element/content/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { ColumnMemo as DsColumnMemo } from '@rinn7e/realworld-design-system/grid/column/component'
import { ColumnsMemo as DsColumnsMemo } from '@rinn7e/realworld-design-system/grid/columns/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { ArrowRight, BookOpen, Layers, Layout, Palette } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const HomePage: React.FC<Props> = () => {
  return (
    <div data-component='HomePage' className='w-full space-y-8 text-left'>
      {/* Hero Banner */}
      <DsHeroMemo
        color='green'
        size='medium'
        className='w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-700 px-8 py-12 text-white shadow-lg'
      >
        <div className='max-w-2xl space-y-4'>
          <div className='inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-sm'>
            Design System &amp; Component Library
          </div>
          <DsTitleMemo
            size={1}
            className='text-4xl font-extrabold text-white sm:text-5xl'
          >
            RealWorld Design System
          </DsTitleMemo>
          <p className='text-lg font-medium text-green-100/90'>
            A pure React &amp; Tailwind CSS component design system built for
            the Elm Architecture (TEA) and FP pattern applications.
          </p>
          <div className='flex items-center gap-3 pt-2'>
            <DsButtonMemo
              color='white'
              variant='solid'
              size='medium'
              className='flex items-center gap-2 font-bold text-green-700 shadow-md transition-transform hover:scale-105'
            >
              <span>Explore Components</span>
              <ArrowRight className='h-4 w-4' />
            </DsButtonMemo>
          </div>
        </div>
      </DsHeroMemo>

      {/* Feature Cards Grid */}
      <DsColumnsMemo>
        <DsColumnMemo size='one-third'>
          <DsCardMemo className='h-full p-6 text-left shadow-xs transition-shadow hover:shadow-md'>
            <div className='flex flex-col gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600'>
                <Layers className='h-6 w-6' />
              </div>
              <DsTitleMemo
                size={4}
                className='font-bold text-gray-900 dark:text-zinc-100'
              >
                Elements
              </DsTitleMemo>
              <DsContentMemo
                size='small'
                className='text-gray-600 dark:text-zinc-400'
              >
                Atomic building blocks including Buttons, Inputs, Titles, Icons,
                Notifications, and Tables with strict color and size variants.
              </DsContentMemo>
            </div>
          </DsCardMemo>
        </DsColumnMemo>

        <DsColumnMemo size='one-third'>
          <DsCardMemo className='h-full p-6 text-left shadow-xs transition-shadow hover:shadow-md'>
            <div className='flex flex-col gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600'>
                <Layout className='h-6 w-6' />
              </div>
              <DsTitleMemo
                size={4}
                className='font-bold text-gray-900 dark:text-zinc-100'
              >
                Components
              </DsTitleMemo>
              <DsContentMemo
                size='small'
                className='text-gray-600 dark:text-zinc-400'
              >
                Composite UI components like Cards, Modals, Breadcrumbs, Navbar,
                Sidebars, and Menus with clear pure state models.
              </DsContentMemo>
            </div>
          </DsCardMemo>
        </DsColumnMemo>

        <DsColumnMemo size='one-third'>
          <DsCardMemo className='h-full p-6 text-left shadow-xs transition-shadow hover:shadow-md'>
            <div className='flex flex-col gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600'>
                <Palette className='h-6 w-6' />
              </div>
              <DsTitleMemo
                size={4}
                className='font-bold text-gray-900 dark:text-zinc-100'
              >
                Form &amp; Layout
              </DsTitleMemo>
              <DsContentMemo
                size='small'
                className='text-gray-600 dark:text-zinc-400'
              >
                Responsive layout containers, flex grid columns, level
                containers, and form field inputs.
              </DsContentMemo>
            </div>
          </DsCardMemo>
        </DsColumnMemo>
      </DsColumnsMemo>

      {/* Quick Start Card */}
      <DsBoxMemo className='rounded-lg border border-gray-200 bg-gray-50 p-6 text-left dark:border-zinc-800 dark:bg-zinc-950'>
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5 text-green-600' />
            <DsTitleMemo
              size={4}
              className='font-bold text-gray-900 dark:text-zinc-100'
            >
              Quick Start
            </DsTitleMemo>
          </div>
          <DsContentMemo>
            <div className='space-y-3 text-sm text-gray-700 dark:text-zinc-300'>
              <p>Install the package into your project workspace:</p>
              <pre className='rounded-md bg-gray-900 p-3 font-mono text-xs text-green-400'>
                pnpm add @rinn7e/realworld-design-system
              </pre>
              <p>
                Import components and render using their view static functions:
              </p>
              <pre className='rounded-md bg-gray-900 p-3 font-mono text-xs text-gray-200'>
                {`import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
 
// Render in your React TEA view function
<DsButtonMemo color='green' variant='solid'>Submit</DsButtonMemo>`}
              </pre>
            </div>
          </DsContentMemo>
        </div>
      </DsBoxMemo>
    </div>
  )
}
