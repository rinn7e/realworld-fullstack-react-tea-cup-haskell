import { ButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TagMemo } from '@rinn7e/realworld-design-system/element/tag/component'
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

export const TagPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Solid Colors
<TagMemo color="gray" children={() => 'gray'} />
<TagMemo color="green" children={() => 'green'} />

// Light Variants
<TagMemo color="gray" variant="light" children={() => 'gray'} />
<TagMemo color="green" variant="light" children={() => 'green'} />

// Outline Variants
<TagMemo color="gray" variant="outline" children={() => 'gray'} />
<TagMemo color="green" variant="outline" children={() => 'green'} />

// Clickable (hover state)
<TagMemo color="green" variant="light" onClick={() => ...} children={() => 'click me'} />

// Deletable
<TagMemo color="green" onDelete={() => ...} children={() => 'conduit'} />`

  return (
    <div data-component='TagPage' className='w-full space-y-8 text-left'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className:
          'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: () => (
          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              ELEMENTS / TAG
            </div>
            <TitleMemo
              size={2}
              className='mb-2 font-extrabold text-gray-900'
              children={() => 'Tag'}
            />
            <p className='text-base text-gray-600'>
              Small tag badges for labels, categories, keyword filters, and
              deletable chips.
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

        {/* Section 1: Solid Colors */}
        {sectionView({
          title: 'Solid Colors',
          children: () => (
            <div className='flex flex-wrap items-center gap-2.5'>
              <TagMemo color='gray' children={() => 'gray'} />
              <TagMemo color='green' children={() => 'green'} />
              <TagMemo color='dark-green' children={() => 'dark-green'} />
              <TagMemo color='sky' children={() => 'sky'} />
              <TagMemo color='amber' children={() => 'amber'} />
              <TagMemo color='red' children={() => 'red'} />
            </div>
          ) })}

        {/* Section 2: Light Variants */}
        {sectionView({
          title: 'Light Variants',
          children: () => (
            <div className='flex flex-wrap items-center gap-2.5'>
              <TagMemo color='gray' variant='light' children={() => 'gray'} />
              <TagMemo color='green' variant='light' children={() => 'green'} />
              <TagMemo
                color='dark-green'
                variant='light'
                children={() => 'dark-green'}
              />
              <TagMemo color='sky' variant='light' children={() => 'sky'} />
              <TagMemo color='amber' variant='light' children={() => 'amber'} />
              <TagMemo color='red' variant='light' children={() => 'red'} />
            </div>
          ) })}

        {/* Section 3: Outline Variants */}
        {sectionView({
          title: 'Outline Variants',
          children: () => (
            <div className='flex flex-wrap items-center gap-2.5'>
              <TagMemo color='gray' variant='outline' children={() => 'gray'} />
              <TagMemo
                color='green'
                variant='outline'
                children={() => 'green'}
              />
              <TagMemo
                color='dark-green'
                variant='outline'
                children={() => 'dark-green'}
              />
              <TagMemo color='sky' variant='outline' children={() => 'sky'} />
              <TagMemo
                color='amber'
                variant='outline'
                children={() => 'amber'}
              />
              <TagMemo color='red' variant='outline' children={() => 'red'} />
            </div>
          ) })}

        {/* Section 4: Sizes & Shapes */}
        {sectionView({
          title: 'Sizes & Shapes',
          children: () => (
            <div className='space-y-4'>
              <div className='flex flex-wrap items-center gap-2.5'>
                <TagMemo color='green' size='small' children={() => 'Small Tag'} />
                <TagMemo
                  color='green'
                  size='normal'
                  children={() => 'Normal Tag'}
                />
                <TagMemo
                  color='green'
                  size='medium'
                  children={() => 'Medium Tag'}
                />
                <TagMemo color='green' size='large' children={() => 'Large Tag'} />
              </div>
              <div className='flex flex-wrap items-center gap-2.5 pt-2'>
                <TagMemo
                  color='sky'
                  isRounded={true}
                  size='small'
                  children={() => 'Rounded Small'}
                />
                <TagMemo
                  color='sky'
                  isRounded={true}
                  size='normal'
                  children={() => 'Rounded Normal'}
                />
                <TagMemo
                  color='sky'
                  isRounded={true}
                  size='medium'
                  children={() => 'Rounded Medium'}
                />
                <TagMemo
                  color='sky'
                  isRounded={true}
                  size='large'
                  children={() => 'Rounded Large'}
                />
              </div>
            </div>
          ) })}

        {/* Section 5: Deletable Chips */}
        {sectionView({
          title: 'Deletable Chips',
          children: () => (
            <div className='flex flex-wrap items-center gap-2.5'>
              <TagMemo
                color='green'
                onDelete={() => alert('Deleted conduit tag!')}
                children={() => 'conduit'}
              />
              <TagMemo
                color='dark-green'
                onDelete={() => alert('Deleted react tag!')}
                children={() => 'react'}
              />
              <TagMemo
                color='sky'
                variant='light'
                onDelete={() => alert('Deleted haskell tag!')}
                children={() => 'haskell'}
              />
              <TagMemo
                color='red'
                onDelete={() => alert('Deleted tea-cup tag!')}
                children={() => 'tea-cup'}
              />
            </div>
          ) })}

        {/* Section 6: Clickable Tags (with Hover States) */}
        {sectionView({
          title: 'Clickable Tags (Hover State)',
          children: () => (
            <div className='space-y-3'>
              <p className='text-xs text-gray-500'>
                Hover states are only applied when a tag has an{' '}
                <code className='rounded bg-gray-100 px-1 py-0.5 font-mono'>
                  onClick
                </code>{' '}
                handler. Try hovering!
              </p>
              <div className='flex flex-wrap items-center gap-2.5'>
                <TagMemo
                  color='gray'
                  variant='light'
                  onClick={() => alert('clicked gray')}
                  children={() => 'gray'}
                />
                <TagMemo
                  color='green'
                  onClick={() => alert('clicked green')}
                  children={() => 'green'}
                />
                <TagMemo
                  color='dark-green'
                  variant='light'
                  onClick={() => alert('clicked dark-green')}
                  children={() => 'dark-green'}
                />
                <TagMemo
                  color='sky'
                  onClick={() => alert('clicked sky')}
                  children={() => 'sky'}
                />
                <TagMemo
                  color='amber'
                  variant='light'
                  onClick={() => alert('clicked amber')}
                  children={() => 'amber'}
                />
                <TagMemo
                  color='red'
                  variant='outline'
                  onClick={() => alert('clicked red')}
                  children={() => 'red'}
                />
              </div>
            </div>
          ) })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Tag Component Code</span>
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
