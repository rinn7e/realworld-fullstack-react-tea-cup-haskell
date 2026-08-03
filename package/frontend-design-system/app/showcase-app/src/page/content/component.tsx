import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { ContentMemo as DsContentMemo } from '@rinn7e/realworld-design-system/element/content/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { Code2, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const ContentPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `<DsContentMemo size='normal'>
  {() => (
    <div>
      <h3 className='text-lg font-bold text-gray-900 mb-2'>Rich Article Content</h3>
      <p className='text-gray-600 mb-3'>
        Clean line-height typography wrapper designed for body copy, markdown articles, and documentation text.
      </p>
    </div>
  )}
</DsContentMemo>`

  return (
    <div data-component='ContentPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo variant="default" size="small" className="rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full" children={() => (<><div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              ELEMENTS / CONTENT
            </div>
            <DsTitleMemo
              size={2}
              className='mb-2 font-extrabold text-gray-900'
              children={() => 'Content'}
            />
            <p className='text-base text-gray-600'>
              Typography content wrapper for rich text formatting and article
              content.
            </p></>)} />

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <DsTitleMemo
            size={5}
            className='flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600'
            children={() => (
              <>
                <Sparkles className='h-4 w-4 text-green-600' />
                <span>Interactive Playground &amp; Code</span>
              </>
            )}
          />
          <DsButtonMemo
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
          title: 'Typography Body Copy',
          children: () => (
            <div className='w-full'>
              <DsContentMemo
                size='normal'
                children={() => (
                  <div>
                    <h3 className='mb-2 text-lg font-bold text-gray-900'>
                      Rich Article Content
                    </h3>
                    <p className='mb-3 leading-relaxed text-gray-600'>
                      Clean line-height typography wrapper designed for body
                      copy, markdown articles, and documentation text.
                    </p>
                  </div>
                )}
              />
            </div>
          ) })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Content Component Code</span>
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
