import React from 'react'
import {
  Button,
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

export const TitlePage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `{Title.view({ size: 1, children: 'Title Size 1 (3xl)' })}
{Title.view({ size: 2, children: 'Title Size 2 (2xl)' })}
{Title.view({ size: 3, children: 'Title Size 3 (xl)' })}
{Title.view({ size: 4, children: 'Title Size 4 (lg)' })}
{Title.view({ size: 5, children: 'Title Size 5 (base)' })}
{Title.view({ size: 6, children: 'Title Size 6 (sm)' })}`

  return (
    <div data-component='TitlePage' className='w-full text-left space-y-8'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className: 'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: (
          <>
            <div className='mb-1 text-xs font-bold uppercase tracking-wider text-green-600'>
              ELEMENTS / TITLE
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: 'Title',
            })}
            <p className='text-base text-gray-600'>
              Heading typography element supporting 6 hierarchical sizes (1 through 6).
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
          title: 'Heading Typography Hierarchy',
          children: (
            <div className='space-y-3 text-left w-full'>
              {Title.view({ size: 1, children: 'Title Size 1' })}
              {Title.view({ size: 2, children: 'Title Size 2' })}
              {Title.view({ size: 3, children: 'Title Size 3' })}
              {Title.view({ size: 4, children: 'Title Size 4' })}
              {Title.view({ size: 5, children: 'Title Size 5' })}
              {Title.view({ size: 6, children: 'Title Size 6' })}
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Title Component Code</span>
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
