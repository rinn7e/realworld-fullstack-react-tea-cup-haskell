import { BreadcrumbMemo } from '@rinn7e/realworld-design-system/component/breadcrumb/component'
import { ButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import * as Hero from '@rinn7e/realworld-design-system/layout/hero/view'
import { TitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { Code2 } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}
export const BreadcrumbPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `<BreadcrumbMemo
  items={[
    { label: 'Home', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Breadcrumb', isActive: true },
  ]}
/>`
  return (
    <div data-component='BreadcrumbPage' className='w-full space-y-8'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        children: () => (
          <div className='flex items-center justify-between'>
            <div>
              {Title.view({
                size: 2,
                className: 'font-bold text-gray-900',
                children: () => 'Breadcrumb Component',
              })}
              <p className='mt-1 text-sm text-gray-500'>
                Breadcrumb navigation bar component.
              </p>
            </div>
            {Button.view({
              color: 'green',
              variant: model.showCode ? 'outline' : 'solid',
              onClick: () => dispatch({ _tag: 'ToggleShowCode' }),
              className: 'gap-2',
              children: () => (
                <>
                  <Code2 className='h-4 w-4' />
                  <span>{model.showCode ? 'Hide Code' : 'View Code'}</span>
                </>
              ),
            })}
          </div>
        ),
      })}

      <div className='space-y-6'>
        {sectionView({
          title: 'Standard Breadcrumb Navigation',
          children: () => (
            <div className='w-full'>
              <BreadcrumbMemo
                items={[
                  { label: 'Home', href: '#' },
                  { label: 'Components', href: '#' },
                  { label: 'Breadcrumb', isActive: true },
                ]}
              />
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Breadcrumb Component Code</span>
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
