import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TableMemo as DsTableMemo } from '@rinn7e/realworld-design-system/element/table/component'
import { TagMemo as DsTagMemo } from '@rinn7e/realworld-design-system/element/tag/component'
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

export const TablePage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Striped & Bordered Table
<DsTableMemo
  isStriped={true}
  isBordered={true}>
    <>
      <thead>
        <tr className='bg-gray-50 border-b border-gray-200'>
          <th className='p-3 text-left font-semibold text-gray-700 dark:text-zinc-300'>Article Title</th>
          <th className='p-3 text-left font-semibold text-gray-700 dark:text-zinc-300'>Author</th>
          <th className='p-3 text-left font-semibold text-gray-700 dark:text-zinc-300'>Tags</th>
          <th className='p-3 text-left font-semibold text-gray-700 dark:text-zinc-300'>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className='p-3 text-gray-900 dark:text-zinc-100 font-medium'>How to build a web app</td>
          <td className='p-3 text-gray-600 dark:text-zinc-400'>Gerard Quan</td>
          <td className='p-3'><DsTagMemo color='green'>react</DsTagMemo></td>
          <td className='p-3'><DsTagMemo color='green' variant='light'>Published</DsTagMemo></td>
        </tr>
      </tbody>
    </>
  </DsTableMemo>`

  return (
    <div data-component='TablePage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        color='gray'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <>
          <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            ELEMENTS / TABLE
          </div>
          <DsTitleMemo
            size={2}
            className='mb-2 font-extrabold text-gray-900 dark:text-zinc-100'
          >
            Table
          </DsTitleMemo>
          <p className='text-base text-gray-600 dark:text-zinc-400'>
            Styled data table for tabular data with support for striped rows,
            borders, hover states, and badge elements.
          </p>
        </>
      </DsHeroMemo>

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <DsTitleMemo
            size={5}
            className='flex items-center gap-2 font-bold tracking-wider text-gray-600 uppercase dark:text-zinc-400'
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

        {/* Section 1: Striped & Bordered Data Table */}
        {sectionView({
          title: 'Striped & Bordered Table',
          boxClassName: 'p-6 w-full',
          children: () => (
            <div className='w-full overflow-x-auto'>
              <DsTableMemo
                isBordered={true}
                isStriped={true}
                isHoverable={true}
              >
                <>
                  <thead>
                    <tr className='border-b border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900'>
                      <th className='p-3 text-left font-semibold text-gray-700 dark:text-zinc-300'>
                        Article Title
                      </th>
                      <th className='p-3 text-left font-semibold text-gray-700 dark:text-zinc-300'>
                        Author
                      </th>
                      <th className='p-3 text-left font-semibold text-gray-700 dark:text-zinc-300'>
                        Tag
                      </th>
                      <th className='p-3 text-left font-semibold text-gray-700 dark:text-zinc-300'>
                        Likes
                      </th>
                      <th className='p-3 text-left font-semibold text-gray-700 dark:text-zinc-300'>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100 dark:divide-zinc-800'>
                    <tr className='border-b border-gray-100 dark:border-zinc-800'>
                      <td className='p-3 font-semibold text-gray-900 dark:text-zinc-100'>
                        How to build web applications that scale
                      </td>
                      <td className='p-3 text-gray-600 dark:text-zinc-400'>
                        Gerard Quan
                      </td>
                      <td className='p-3'>
                        <DsTagMemo color='green'>react</DsTagMemo>
                      </td>
                      <td className='p-3 font-mono text-gray-700 dark:text-zinc-300'>
                        1,240
                      </td>
                      <td className='p-3'>
                        <DsTagMemo color='green' variant='light'>
                          Published
                        </DsTagMemo>
                      </td>
                    </tr>
                    <tr className='border-b border-gray-100 dark:border-zinc-800'>
                      <td className='p-3 font-semibold text-gray-900 dark:text-zinc-100'>
                        The Elm Architecture in React and Haskell
                      </td>
                      <td className='p-3 text-gray-600 dark:text-zinc-400'>
                        Anson Cheung
                      </td>
                      <td className='p-3'>
                        <DsTagMemo color='sky'>haskell</DsTagMemo>
                      </td>
                      <td className='p-3 font-mono text-gray-700 dark:text-zinc-300'>
                        892
                      </td>
                      <td className='p-3'>
                        <DsTagMemo color='green' variant='light'>
                          Published
                        </DsTagMemo>
                      </td>
                    </tr>
                    <tr className='border-b border-gray-100 dark:border-zinc-800'>
                      <td className='p-3 font-semibold text-gray-900 dark:text-zinc-100'>
                        Functional Programming with fp-ts and io-ts
                      </td>
                      <td className='p-3 text-gray-600 dark:text-zinc-400'>
                        Albert Chen
                      </td>
                      <td className='p-3'>
                        <DsTagMemo color='dark-green'>fp-ts</DsTagMemo>
                      </td>
                      <td className='p-3 font-mono text-gray-700 dark:text-zinc-300'>
                        415
                      </td>
                      <td className='p-3'>
                        <DsTagMemo color='amber' variant='light'>
                          Draft
                        </DsTagMemo>
                      </td>
                    </tr>
                  </tbody>
                </>
              </DsTableMemo>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Table Component Code
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
