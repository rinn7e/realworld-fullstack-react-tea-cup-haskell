import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { DeleteMemo as DsDeleteMemo } from '@rinn7e/realworld-design-system/element/delete/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { Code2, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const DeletePage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Delete Button Sizes
<DsDeleteMemo size='small' onClick={() => alert('Deleted!')} />
<DsDeleteMemo size='normal' onClick={() => alert('Deleted!')} />
<DsDeleteMemo size='medium' onClick={() => alert('Deleted!')} />
<DsDeleteMemo size='large' onClick={() => alert('Deleted!')} />`

  return (
    <div data-component='DeletePage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        variant='default'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6'
      >
        <>
          <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            ELEMENTS / DELETE
          </div>
          <DsTitleMemo size={2} className='mb-2 font-extrabold text-gray-900'>
            Delete
          </DsTitleMemo>
          <p className='text-base text-gray-600'>
            Standalone delete cross icon button element with small to large size
            support.
          </p>
        </>
      </DsHeroMemo>

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <DsTitleMemo
            size={5}
            className='flex items-center gap-2 font-bold tracking-wider text-gray-600 uppercase'
          >
            <>
              <Sparkles className='h-4 w-4 text-green-600' />
              <span>Interactive Playground &amp; Code</span>
            </>
          </DsTitleMemo>
          <DsButtonMemo
            color='green'
            variant='link'
            size='small'
            onClick={() => dispatch({ _tag: 'ToggleShowCode' })}
            className='flex items-center gap-1 font-semibold text-green-600 hover:underline'
          >
            <Code2 className='h-3.5 w-3.5' />
            <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
          </DsButtonMemo>
        </div>

        {sectionView({
          title: 'Delete Icon Button Sizes',
          children: () => (
            <div className='flex items-center gap-6'>
              <DsDeleteMemo size='small' onClick={() => alert('Deleted!')} />
              <DsDeleteMemo size='normal' onClick={() => alert('Deleted!')} />
              <DsDeleteMemo size='medium' onClick={() => alert('Deleted!')} />
              <DsDeleteMemo size='large' onClick={() => alert('Deleted!')} />
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Delete Component Code</span>
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
