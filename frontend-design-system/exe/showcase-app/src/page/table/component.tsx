import React from 'react'
import {
  Button,
  Hero,
  Table,
  Tag,
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
    <div data-component='TablePage' className='w-full text-left space-y-8'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className: 'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: (
          <>
            <div className='mb-1 text-xs font-bold uppercase tracking-wider text-green-600'>
              ELEMENTS / TABLE
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: 'Table',
            })}
            <p className='text-base text-gray-600'>
              Styled data table for tabular data with support for striped rows, borders, hover states, and badge elements.
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

        {/* Section 1: Striped & Bordered Data Table */}
        {sectionView({
          title: 'Striped & Bordered Table',
          boxClassName: 'p-6 w-full',
          children: (
            <div className='w-full overflow-x-auto'>
              {Table.view({
                isBordered: true,
                isStriped: true,
                isHoverable: true,
                children: (
                  <>
                    <thead>
                      <tr className='bg-gray-50 border-b border-gray-200'>
                        <th className='p-3 text-left font-semibold text-gray-700'>Article Title</th>
                        <th className='p-3 text-left font-semibold text-gray-700'>Author</th>
                        <th className='p-3 text-left font-semibold text-gray-700'>Tag</th>
                        <th className='p-3 text-left font-semibold text-gray-700'>Likes</th>
                        <th className='p-3 text-left font-semibold text-gray-700'>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='border-b border-gray-100'>
                        <td className='p-3 text-gray-900 font-semibold'>How to build web applications that scale</td>
                        <td className='p-3 text-gray-600'>Gerard Quan</td>
                        <td className='p-3'>{Tag.view({ variant: 'primary', children: 'react' })}</td>
                        <td className='p-3 text-gray-700 font-mono'>1,240</td>
                        <td className='p-3'>{Tag.view({ variant: 'success', isLight: true, children: 'Published' })}</td>
                      </tr>
                      <tr className='border-b border-gray-100'>
                        <td className='p-3 text-gray-900 font-semibold'>The Elm Architecture in React and Haskell</td>
                        <td className='p-3 text-gray-600'>Anson Cheung</td>
                        <td className='p-3'>{Tag.view({ variant: 'info', children: 'haskell' })}</td>
                        <td className='p-3 text-gray-700 font-mono'>892</td>
                        <td className='p-3'>{Tag.view({ variant: 'success', isLight: true, children: 'Published' })}</td>
                      </tr>
                      <tr className='border-b border-gray-100'>
                        <td className='p-3 text-gray-900 font-semibold'>Functional Programming with fp-ts and io-ts</td>
                        <td className='p-3 text-gray-600'>Albert Chen</td>
                        <td className='p-3'>{Tag.view({ variant: 'link', children: 'fp-ts' })}</td>
                        <td className='p-3 text-gray-700 font-mono'>415</td>
                        <td className='p-3'>{Tag.view({ variant: 'warning', isLight: true, children: 'Draft' })}</td>
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
            <pre className='whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-300'>
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
