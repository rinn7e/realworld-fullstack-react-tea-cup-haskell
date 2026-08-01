import { Button, Hero, Level, Title } from '@rinn7e/realworld-design-system'
import { Code2, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const LevelPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `{Level.view({
  children: (
    <div className='flex justify-between items-center w-full'>
      <span className='font-semibold text-gray-800'>Left Alignment Item</span>
      <span className='text-sm text-green-600 font-bold'>Right Alignment Item</span>
    </div>
  ),
})}`

  return (
    <div data-component='LevelPage' className='w-full space-y-8 text-left'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className:
          'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: (
          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              LAYOUT / LEVEL
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: 'Level',
            })}
            <p className='text-base text-gray-600'>
              Horizontal layout container for multi-part items like headers,
              toolbars, and split rows.
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
            className:
              'flex items-center gap-1 font-semibold text-green-600 hover:underline',
            children: (
              <>
                <Code2 className='h-3.5 w-3.5' />
                <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
              </>
            ),
          })}
        </div>

        {sectionView({
          title: 'Split Horizontal Level',
          children: (
            <div className='w-full'>
              {Level.view({
                children: (
                  <div className='flex w-full items-center justify-between'>
                    <span className='font-semibold text-gray-800'>
                      Left Alignment Item
                    </span>
                    <span className='text-sm font-bold text-green-600'>
                      Right Alignment Item
                    </span>
                  </div>
                ),
              })}
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Level Component Code</span>
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
