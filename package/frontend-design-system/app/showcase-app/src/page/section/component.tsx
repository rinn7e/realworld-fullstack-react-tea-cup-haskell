import { Button, Hero, Section, Title } from '@rinn7e/realworld-design-system'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}
export const SectionPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `{Section.view({
  size: 'medium',
  className: 'bg-gray-50 border border-gray-200 rounded-lg p-6',
  children: Title.view({ size: 3, children: 'Content Section Title' }),
})}`
  return (
    <div data-component='SectionPage' className='w-full space-y-8 text-left'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className:
          'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: () => (
          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              LAYOUT / SECTION
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: () => 'Section',
            })}
            <p className='text-base text-gray-600'>
              Standard layout section container with customizable vertical
              padding.
            </p>
          </>
        ),
      })}

      <div className='w-full space-y-6'>
        <div className='flex items-center justify-end'>
          {Button.view({
            variant: 'link',
            size: 'small',
            onClick: () => dispatch({ _tag: 'ToggleShowCode' }),
            children: () => (
              <span>
                {model.showCode ? 'Hide Code' : 'View Code'} &lt;/&gt;
              </span>
            ),
          })}
        </div>

        {sectionView({
          title: 'Layout Section Container',
          children: () => (
            <div className='w-full'>
              {Section.view({
                size: 'medium',
                className: 'bg-gray-50 border border-gray-200 rounded-lg p-6',
                children: () =>
                  Title.view({
                    size: 3,
                    children: () => 'Content Section Title',
                  }),
              })}
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Section Component Code</span>
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
