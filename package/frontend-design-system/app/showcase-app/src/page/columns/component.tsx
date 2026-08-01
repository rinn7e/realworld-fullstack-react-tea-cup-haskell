import {
  Button,
  Column,
  Columns,
  Hero,
  Title,
} from '@rinn7e/realworld-design-system'
import { Code2, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const ColumnsPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `{Columns.view({
  children: (
    <>
      {Column.view({ size: 'half', children: <div className='p-4 bg-green-50 border border-green-200 text-green-800 rounded font-semibold text-center'>Half Width (6/12)</div> })}
      {Column.view({ size: 'half', children: <div className='p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded font-semibold text-center'>Half Width (6/12)</div> })}
    </>
  ),
})}`

  return (
    <div data-component='ColumnsPage' className='w-full space-y-8 text-left'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className:
          'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: (
          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              GRID / COLUMNS
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: 'Columns',
            })}
            <p className='text-base text-gray-600'>
              Flexbox multi-column grid layout system supporting fractional
              column sizing.
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
          title: '2-Column Grid Layout',
          children: (
            <div className='w-full'>
              {Columns.view({
                children: (
                  <>
                    {Column.view({
                      size: 'half',
                      children: (
                        <div className='rounded border border-green-200 bg-green-50 p-4 text-center font-semibold text-green-800'>
                          Column 1 (Half)
                        </div>
                      ),
                    })}
                    {Column.view({
                      size: 'half',
                      children: (
                        <div className='rounded border border-blue-200 bg-blue-50 p-4 text-center font-semibold text-blue-800'>
                          Column 2 (Half)
                        </div>
                      ),
                    })}
                  </>
                ),
              })}
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Columns Component Code</span>
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
