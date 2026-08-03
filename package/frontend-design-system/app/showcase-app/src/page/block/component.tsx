import { HeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { BlockMemo } from '@rinn7e/realworld-design-system/element/block/component'
import { ButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { Code2, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const BlockPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `<BlockMemo
  children={() => (
    <div className='p-4 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700'>
      First layout block container with margin spacing.
    </div>
  )}
/>
<BlockMemo
  children={() => (
    <div className='p-4 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700'>
      Second layout block container.
    </div>
  )}
/>`

  return (
    <div data-component='BlockPage' className='w-full space-y-8 text-left'>
      <HeroMemo variant="default" size="small" className="rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full" children={() => (<><div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              ELEMENTS / BLOCK
            </div>
            <TitleMemo
              size={2}
              className='mb-2 font-extrabold text-gray-900'
              children={() => 'Block'}
            />
            <p className='text-base text-gray-600'>
              Simple layout block element with vertical bottom spacing to
              separate elements.
            </p></>)} />

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
          title: 'Layout Block Spacing',
          children: () => (
            <div className='w-full space-y-3'>
              <BlockMemo
                children={() => (
                  <p className='rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700'>
                    First Layout Block Container
                  </p>
                )}
              />
              <BlockMemo
                children={() => (
                  <p className='rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700'>
                    Second Layout Block Container
                  </p>
                )}
              />
            </div>
          ) })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Block Component Code</span>
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
