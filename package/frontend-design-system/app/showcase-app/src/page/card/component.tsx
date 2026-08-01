import React from 'react'
import {
  Button,
  Card,
  Content,
  Hero,
  Title,
} from '@rinn7e/realworld-design-system'
import { Code2, Sparkles } from 'lucide-react'
import type { Dispatcher } from 'tea-cup-fp'
import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const CardPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `{Card.view({
  header: 'How to Build a Design System',
  footer: (
    <div className='flex items-center justify-between text-xs text-gray-500'>
      <span>Author: Albert Chen</span>
      <span>5 min read</span>
    </div>
  ),
  children: Content.view({
    size: 'normal',
    children: 'An introduction to modular component design architecture built with React and Tailwind CSS.',
  }),
})}`

  return (
    <div data-component='CardPage' className='w-full text-left space-y-8'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className: 'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: (
          <>
            <div className='mb-1 text-xs font-bold uppercase tracking-wider text-green-600'>
              COMPONENTS / CARD
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: 'Card',
            })}
            <p className='text-base text-gray-600'>
              A flexible and extensible content container with header, content body, and footer actions.
            </p>
          </>
        ),
      })}

      <div className='flex flex-col gap-6 w-full'>
        <div className='flex items-center justify-between w-full'>
          {Title.view({
            size: 5,
            className: 'flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600',
            children: (
              <>
                <Sparkles className='h-4 w-4 text-green-600' />
                <span>Interactive Playground &amp; Code</span>
              </>
            ),
          })}
          {Button.view({
            variant: 'link',
            size: 'small',
            onClick: () => dispatch({ _tag: 'ToggleShowCode' }),
            className: 'flex items-center gap-1 font-semibold text-green-600 hover:underline',
            children: (
              <>
                <Code2 className='h-3.5 w-3.5' />
                <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
              </>
            ),
          })}
        </div>

        {sectionView({
          title: 'Card with Header & Footer',
          children: (
            <div className='w-full flex justify-center'>
              <div className='w-full max-w-md'>
                {Card.view({
                  header: 'How to Build a Design System',
                  footer: (
                    <div className='flex items-center justify-between text-xs text-gray-500 w-full'>
                      <span>Author: Albert Chen</span>
                      <span>5 min read</span>
                    </div>
                  ),
                  children: Content.view({
                    size: 'normal',
                    children: 'An introduction to modular component design architecture built with React, Tailwind CSS v4, and the Elm Architecture.',
                  }),
                })}
              </div>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Card Component Code</span>
            </div>
            <pre className='whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-300'>
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
