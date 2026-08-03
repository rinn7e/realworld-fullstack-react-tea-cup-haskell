import { ButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import * as Hero from '@rinn7e/realworld-design-system/layout/hero/view'
import { Code2, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const TitlePage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `<TitleMemo size={1} children={() => 'Title Size 1'} />
<TitleMemo size={2} children={() => 'Title Size 2'} />
<TitleMemo size={3} children={() => 'Title Size 3'} />
<TitleMemo size={4} children={() => 'Title Size 4'} />
<TitleMemo size={5} children={() => 'Title Size 5'} />
<TitleMemo size={6} children={() => 'Title Size 6'} />`

  return (
    <div data-component='TitlePage' className='w-full space-y-8 text-left'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className:
          'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: () => (
          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              ELEMENTS / TITLE
            </div>
            <TitleMemo
              size={2}
              className='mb-2 font-extrabold text-gray-900'
              children={() => 'Title'}
            />
            <p className='text-base text-gray-600'>
              Heading typography element supporting 6 hierarchical sizes (1
              through 6).
            </p>
          </>
        ) })}

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <TitleMemo
            size={5}
            className='flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600'
            children={() => (
              <>
                <Sparkles className='h-4 w-4 text-green-600' />
                <span>Interactive Playground &amp; Code</span>
              </>
            )}
          />
          <ButtonMemo
            color='green'
            variant='link'
            size='small'
            onClick={() => dispatch({ _tag: 'ToggleShowCode' })}
            className='flex items-center gap-1 font-semibold text-green-600 hover:underline'
            children={() => (
              <>
                <Code2 className='h-3.5 w-3.5' />
                <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
              </>
            )}
          />
        </div>

        {sectionView({
          title: 'Heading Typography Hierarchy',
          children: () => (
            <div className='w-full space-y-3 text-left'>
              <TitleMemo size={1} children={() => 'Title Size 1'} />
              <TitleMemo size={2} children={() => 'Title Size 2'} />
              <TitleMemo size={3} children={() => 'Title Size 3'} />
              <TitleMemo size={4} children={() => 'Title Size 4'} />
              <TitleMemo size={5} children={() => 'Title Size 5'} />
              <TitleMemo size={6} children={() => 'Title Size 6'} />
            </div>
          ) })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Title Component Code</span>
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
