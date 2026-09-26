import { BreadcrumbMemo as DsBreadcrumbMemo } from '@rinn7e/realworld-design-system/component/breadcrumb/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { Code2 } from 'lucide-react'
import { memo } from 'react'

import {
  DEFAULT_SECTION_BOX_CLASS,
  SectionViewMemo,
} from '@/component/section-view'

import { type Props, PropsEq } from './type'

const BreadcrumbPageComponent = ({ model, dispatch }: Props) => {
  const code = `<DsBreadcrumbMemo
  items={[
    { label: 'Home', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Breadcrumb', isActive: true },
  ]}
/>`

  return (
    <div data-component='BreadcrumbPage' className='flex w-full flex-col gap-8'>
      <DsHeroMemo color='gray' size='small'>
        <div className='flex items-center justify-between'>
          <div>
            <DsTitleMemo
              size={2}
              className='font-bold text-gray-900 dark:text-zinc-100'
            >
              Breadcrumb Component
            </DsTitleMemo>
            <p className='pt-1 text-sm text-gray-500 dark:text-zinc-400'>
              Breadcrumb navigation bar component.
            </p>
          </div>
          <DsButtonMemo
            color='green'
            variant={model.showCode ? 'outline' : 'solid'}
            onClick={() => dispatch({ _tag: 'ToggleShowCode' })}
            className='gap-2'
          >
            <Code2 className='h-4 w-4' />
            <span>{model.showCode ? 'Hide Code' : 'View Code'}</span>
          </DsButtonMemo>
        </div>
      </DsHeroMemo>

      <div className='flex flex-col gap-6'>
        <SectionViewMemo
          title='Standard Breadcrumb Navigation'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='w-full'>
            <DsBreadcrumbMemo
              items={[
                { label: 'Home', href: '#' },
                { label: 'Components', href: '#' },
                { label: 'Breadcrumb', isActive: true },
              ]}
            />
          </div>
        </SectionViewMemo>

        {model.showCode && (
          <div className='relative flex w-full flex-col gap-3 overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Breadcrumb Component Code
              </span>
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

export const BreadcrumbPageMemo = memo(BreadcrumbPageComponent, PropsEq.equals)
