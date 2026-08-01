import {
  Button,
  Hero,
  Table,
  Tag,
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
export const TablePage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Striped & Bordered Table
{Table.view({
  isStriped: true,
  isBordered: true,
  children: (
    <>
      <thead>
        <tr className='bg-gray-50 border-b border-gray-200'>
          <th className='p-3 text-left font-semibold text-gray-700'>Article Title</th>
          <th className='p-3 text-left font-semibold text-gray-700'>Author</th>
          <th className='p-3 text-left font-semibold text-gray-700'>Tags</th>
          <th className='p-3 text-left font-semibold text-gray-700'>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className='p-3 text-gray-900 font-medium'>How to build a web app</td>
          <td className='p-3 text-gray-600'>Gerard Quan</td>
          <td className='p-3'>{Tag.view({ variant: 'primary', children: 'react' })}</td>
          <td className='p-3'>{Tag.view({ variant: 'success', isLight: true, children: 'Published' })}</td>
        </tr>
      </tbody>
    </>
  ),
})}`
  return (
    <div data-component='TablePage' className='w-full space-y-8 text-left'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className:
          'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: () => (
          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              ELEMENTS / TABLE
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: () => 'Table',
            })}
            <p className='text-base text-gray-600'>
              Styled data table for tabular data with support for striped rows,
              borders, hover states, and badge elements.
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
            children: () => (
              <>
                <Sparkles className='h-4 w-4 text-green-600' />
                <span>Interactive Playground &amp; Code</span>
              </>
            ),
          })}
          {Button.view({
            color: 'green',
            variant: 'link',
            size: 'small',
            onClick: () => dispatch({ _tag: 'ToggleShowCode' }),
            className:
              'flex items-center gap-1 font-semibold text-green-600 hover:underline',
            children: () => (
              <>
                <Code2 className='h-3.5 w-3.5' />
                <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
              </>
            ),
          })}
        </div>

        {/* Section 1: Striped & Bordered Data Table */}
        {sectionView({
          title: 'Striped & Bordered Table',
          boxClassName: 'p-6 w-full',
          children: () => (
            <div className='w-full overflow-x-auto'>
              {Table.view({
                isBordered: true,
                isStriped: true,
                isHoverable: true,
                children: () => (
                  <>
                    <thead>
                      <tr className='border-b border-gray-200 bg-gray-50'>
                        <th className='p-3 text-left font-semibold text-gray-700'>
                          Article Title
                        </th>
                        <th className='p-3 text-left font-semibold text-gray-700'>
                          Author
                        </th>
                        <th className='p-3 text-left font-semibold text-gray-700'>
                          Tag
                        </th>
                        <th className='p-3 text-left font-semibold text-gray-700'>
                          Likes
                        </th>
                        <th className='p-3 text-left font-semibold text-gray-700'>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='border-b border-gray-100'>
                        <td className='p-3 font-semibold text-gray-900'>
                          How to build web applications that scale
                        </td>
                        <td className='p-3 text-gray-600'>Gerard Quan</td>
                        <td className='p-3'>
                          {Tag.view({
                            color: 'green',
                            children: () => 'react',
                          })}
                        </td>
                        <td className='p-3 font-mono text-gray-700'>1,240</td>
                        <td className='p-3'>
                          {Tag.view({
                            color: 'green',
                            variant: 'light',
                            children: () => 'Published',
                          })}
                        </td>
                      </tr>
                      <tr className='border-b border-gray-100'>
                        <td className='p-3 font-semibold text-gray-900'>
                          The Elm Architecture in React and Haskell
                        </td>
                        <td className='p-3 text-gray-600'>Anson Cheung</td>
                        <td className='p-3'>
                          {Tag.view({
                            color: 'sky',
                            children: () => 'haskell',
                          })}
                        </td>
                        <td className='p-3 font-mono text-gray-700'>892</td>
                        <td className='p-3'>
                          {Tag.view({
                            color: 'green',
                            variant: 'light',
                            children: () => 'Published',
                          })}
                        </td>
                      </tr>
                      <tr className='border-b border-gray-100'>
                        <td className='p-3 font-semibold text-gray-900'>
                          Functional Programming with fp-ts and io-ts
                        </td>
                        <td className='p-3 text-gray-600'>Albert Chen</td>
                        <td className='p-3'>
                          {Tag.view({
                            color: 'dark-green',
                            children: () => 'fp-ts',
                          })}
                        </td>
                        <td className='p-3 font-mono text-gray-700'>415</td>
                        <td className='p-3'>
                          {Tag.view({
                            color: 'amber',
                            variant: 'light',
                            children: () => 'Draft',
                          })}
                        </td>
                      </tr>
                    </tbody>
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
              <span className='text-gray-500'>Table Component Code</span>
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
