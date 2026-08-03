import { CardMemo } from '@rinn7e/realworld-design-system/component/card/component'
import * as Box from '@rinn7e/realworld-design-system/element/box/view'
import * as Button from '@rinn7e/realworld-design-system/element/button/view'
import * as Column from '@rinn7e/realworld-design-system/grid/column/view'
import * as Columns from '@rinn7e/realworld-design-system/grid/columns/view'
import * as Content from '@rinn7e/realworld-design-system/element/content/view'
import * as Hero from '@rinn7e/realworld-design-system/layout/hero/view'
import * as Tag from '@rinn7e/realworld-design-system/element/tag/view'
import * as Title from '@rinn7e/realworld-design-system/element/title/view'
import { BookOpen, Code2, Layers, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import type { AppRoute } from '../../route/type'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
  navigateRoute: (route: AppRoute) => void
}

export const HomePage: React.FC<Props> = ({ navigateRoute }) => {
  return (
    <div data-component='HomePage' className='w-full space-y-8'>
      {/* Hero Banner Intro */}
      {Hero.view({
        variant: 'primary',
        size: 'medium',
        className: 'w-full rounded-xl p-8 shadow-md text-left',
        children: () => (
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              {Tag.view({
                color: 'gray',
                size: 'normal',
                isRounded: true,
                children: () => '@rinn7e/realworld-design-system',
              })}
              {Tag.view({
                color: 'gray',
                variant: 'light',
                size: 'small',
                isRounded: true,
                children: () => 'v0.1.0',
              })}
            </div>
            {Title.view({
              size: 1,
              className:
                'font-titillium font-extrabold text-white tracking-tight',
              children: () => 'Conduit RealWorld Design System',
            })}
            <p className='max-w-2xl text-lg leading-relaxed font-light text-green-50 opacity-95'>
              A modern, production-grade UI component library for Conduit
              RealWorld apps built with React 19, Tailwind CSS v4, and The Elm
              Architecture (TEA).
            </p>
            <div className='flex items-center gap-4 pt-2'>
              {Button.view({
                color: 'white',
                variant: 'solid',
                size: 'medium',
                isRounded: true,
                onClick: () =>
                  navigateRoute({
                    page: { _tag: 'ButtonPage' },
                  }),
                children: () => 'Explore Components →',
              })}
            </div>
          </div>
        ),
      })}

      {/* Grid of Key Features */}
      {Columns.view({
        children: () => (
          <>
            {Column.view({
              size: 'one-third',
              children: () => (
                <CardMemo
                  header={
                    <div className='flex items-center gap-2 text-base font-bold text-green-600'>
                      <Layers className='h-5 w-5' />
                      <span>35 RealWorld Elements</span>
                    </div>
                  }
                >
                  {() =>
                    Content.view({
                      size: 'small',
                      className: 'text-gray-600',
                      children: () =>
                        'Complete coverage of elements, components, forms, layouts, and grid systems exported as pure TypeScript functions.',
                    })
                  }
                </CardMemo>
              ),
            })}
            {Column.view({
              size: 'one-third',
              children: () => (
                <CardMemo
                  header={
                    <div className='flex items-center gap-2 text-base font-bold text-sky-600'>
                      <Sparkles className='h-5 w-5' />
                      <span>Pure Tailwind CSS v4</span>
                    </div>
                  }
                >
                  {() =>
                    Content.view({
                      size: 'small',
                      className: 'text-gray-600',
                      children: () =>
                        'Zero runtime CSS-in-JS dependencies! Built cleanly with Tailwind v4 utilities and automated source scanning.',
                    })
                  }
                </CardMemo>
              ),
            })}
            {Column.view({
              size: 'one-third',
              children: () => (
                <CardMemo
                  header={
                    <div className='flex items-center gap-2 text-base font-bold text-amber-600'>
                      <Code2 className='h-5 w-5' />
                      <span>Elm Architecture (TEA)</span>
                    </div>
                  }
                >
                  {() =>
                    Content.view({
                      size: 'small',
                      className: 'text-gray-600',
                      children: () =>
                        'Stateless presentation view functions designed for tea-cup state machines and deterministic frontend updates.',
                    })
                  }
                </CardMemo>
              ),
            })}
          </>
        ),
      })}

      {/* Quick Start Card */}
      {Box.view({
        className: 'p-6 bg-gray-50 border border-gray-200 rounded-lg text-left',
        children: () => (
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <BookOpen className='h-5 w-5 text-green-600' />
              {Title.view({
                size: 4,
                className: 'font-bold text-gray-900',
                children: () => 'Quick Start',
              })}
            </div>
            {Content.view({
              children: () => (
                <div className='space-y-3 text-sm text-gray-700'>
                  <p>Install the package into your project workspace:</p>
                  <pre className='rounded-md bg-gray-900 p-3 font-mono text-xs text-green-400'>
                    pnpm add @rinn7e/realworld-design-system
                  </pre>
                  <p>
                    Import components and render using their view static
                    functions:
                  </p>
                  <pre className='rounded-md bg-gray-900 p-3 font-mono text-xs text-gray-200'>
                    {`import { Button, Columns, Column } from '@rinn7e/realworld-design-system'

// Render in your React TEA view function
{Button.view({
            color: 'green',
            variant: 'solid', children: 'Submit' })}`}
                  </pre>
                </div>
              ),
            })}
          </div>
        ),
      })}
    </div>
  )
}
