import { MessageMemo as DsMessageMemo } from '@rinn7e/realworld-design-system/component/message/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
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

export const MessagePage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Color Variants (white, green, dark-green, sky, amber, red, gray)
<DsMessageMemo color='white' header='White Message'>White message container content.</DsMessageMemo>
<DsMessageMemo color='green' header='Green Message'>Green message container content.</DsMessageMemo>
<DsMessageMemo color='dark-green' header='Dark Green Message'>Dark green message container content.</DsMessageMemo>
<DsMessageMemo color='sky' header='Sky Message'>Sky message container content.</DsMessageMemo>
<DsMessageMemo color='amber' header='Amber Message'>Amber message container content.</DsMessageMemo>
<DsMessageMemo color='red' header='Red Message'>Red message container content.</DsMessageMemo>
<DsMessageMemo color='gray' header='Gray Message'>Gray message container content.</DsMessageMemo>`

  return (
    <div data-component='MessagePage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        color='gray'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <>
          <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            COMPONENTS / MESSAGE
          </div>
          <DsTitleMemo
            size={2}
            className='mb-2 font-extrabold text-gray-900 dark:text-zinc-100'
          >
            Message
          </DsTitleMemo>
          <p className='text-base text-gray-600 dark:text-zinc-400'>
            Structured message container with colored headers, body text, and
            optional dismiss actions.
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

        {/* Section 1: Color Variants */}
        {sectionView({
          title: 'Color Variants',
          children: () => (
            <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
              <DsMessageMemo color='white' header='White Message'>
                White message header and body block.
              </DsMessageMemo>
              <DsMessageMemo color='green' header='Green Message'>
                Green message header and body block.
              </DsMessageMemo>
              <DsMessageMemo color='dark-green' header='Dark Green Message'>
                Dark green message header and body block.
              </DsMessageMemo>
              <DsMessageMemo color='sky' header='Sky Message'>
                Sky message header and body block.
              </DsMessageMemo>
              <DsMessageMemo color='amber' header='Amber Message'>
                Amber message header and body block.
              </DsMessageMemo>
              <DsMessageMemo color='red' header='Red Message'>
                Red message header and body block.
              </DsMessageMemo>
              <DsMessageMemo color='gray' header='Gray Message'>
                Gray message header and body block.
              </DsMessageMemo>
            </div>
          ),
        })}

        {/* Section 2: Dismissible Message */}
        {sectionView({
          title: 'Dismissible Message',
          children: () => (
            <div className='w-full'>
              <DsMessageMemo
                color='green'
                header='System Maintenance Notice'
                onDelete={() => alert('Message dismissed!')}
              >
                Scheduled maintenance will take place tonight at 02:00 UTC.
              </DsMessageMemo>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Message Component Code
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
