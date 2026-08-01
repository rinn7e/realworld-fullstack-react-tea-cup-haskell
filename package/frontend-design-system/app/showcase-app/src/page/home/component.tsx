import React from 'react'
import {
  Box,
  Button,
  Card,
  Column,
  Columns,
  Content,
  Hero,
  Tag,
  Title,
} from '@rinn7e/realworld-design-system'
import { BookOpen, Code2, Layers, Sparkles } from 'lucide-react'
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
        children: (
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              {Tag.view({
                variant: 'dark',
                size: 'normal',
                isRounded: true,
                children: '@rinn7e/realworld-design-system',
              })}
              {Tag.view({
                variant: 'light',
                size: 'small',
                isRounded: true,
                children: 'v0.1.0',
              })}
            </div>
            {Title.view({
              size: 1,
              className: 'font-titillium font-extrabold text-white tracking-tight',
              children: 'Conduit RealWorld Design System',
            })}
            <p className='max-w-2xl text-lg font-light text-green-50 opacity-95 leading-relaxed'>
              A modern, production-grade UI component library for Conduit RealWorld apps built with React 19, Tailwind CSS v4, and The Elm Architecture (TEA).
            </p>
            <div className='pt-2 flex items-center gap-4'>
              {Button.view({
                variant: 'default',
                size: 'medium',
                isRounded: true,
                onClick: () =>
                  navigateRoute({
                    page: { _tag: 'ButtonPage' },
                  }),
                children: 'Explore Components →',
              })}
            </div>
          </div>
        ),
      })}

      {/* Grid of Key Features */}
      {Columns.view({
        children: (
          <>
            {Column.view({
              size: 'one-third',
              children: Card.view({
                header: (
                  <div className='flex items-center gap-2 text-green-600 font-bold text-base'>
                    <Layers className='h-5 w-5' />
                    <span>35 RealWorld Elements</span>
                  </div>
                ),
                children: Content.view({
                  size: 'small',
                  className: 'text-gray-600',
                  children:
                    'Complete coverage of Bulma-styled elements, components, forms, layouts, and grid systems exported as pure TypeScript functions.',
                }),
              }),
            })}
            {Column.view({
              size: 'one-third',
              children: Card.view({
                header: (
                  <div className='flex items-center gap-2 text-sky-600 font-bold text-base'>
                    <Sparkles className='h-5 w-5' />
                    <span>Pure Tailwind CSS v4</span>
                  </div>
                ),
                children: Content.view({
                  size: 'small',
                  className: 'text-gray-600',
                  children:
                    'Zero runtime CSS-in-JS dependencies! Built cleanly with Tailwind v4 utilities and automated source scanning.',
                }),
              }),
            })}
            {Column.view({
              size: 'one-third',
              children: Card.view({
                header: (
                  <div className='flex items-center gap-2 text-amber-600 font-bold text-base'>
                    <Code2 className='h-5 w-5' />
                    <span>Elm Architecture (TEA)</span>
                  </div>
                ),
                children: Content.view({
                  size: 'small',
                  className: 'text-gray-600',
                  children:
                    'Stateless presentation view functions designed for tea-cup state machines and deterministic frontend updates.',
                }),
              }),
            })}
          </>
        ),
      })}

      {/* Quick Start Card */}
      {Box.view({
        className: 'p-6 bg-gray-50 border border-gray-200 rounded-lg text-left',
        children: (
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <BookOpen className='h-5 w-5 text-green-600' />
              {Title.view({
                size: 4,
                className: 'font-bold text-gray-900',
                children: 'Quick Start',
              })}
            </div>
            {Content.view({
              children: (
                <div className='space-y-3 text-sm text-gray-700'>
                  <p>Install the package into your project workspace:</p>
                  <pre className='p-3 bg-gray-900 text-green-400 font-mono text-xs rounded-md'>
                    pnpm add @rinn7e/realworld-design-system
                  </pre>
                  <p>Import components and render using their view static functions:</p>
                  <pre className='p-3 bg-gray-900 text-gray-200 font-mono text-xs rounded-md'>
                    {`import { Button, Columns, Column } from '@rinn7e/realworld-design-system'

// Render in your React TEA view function
{Button.view({ variant: 'primary', children: 'Submit' })}`}
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
