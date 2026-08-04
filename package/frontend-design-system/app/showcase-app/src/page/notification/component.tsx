import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { NotificationMemo as DsNotificationMemo } from '@rinn7e/realworld-design-system/element/notification/component'
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

export const NotificationPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Standard Notifications
<DsNotificationMemo variant='default'>Default notification banner alert.</DsNotificationMemo>
<DsNotificationMemo variant='primary'>Primary notification banner alert.</DsNotificationMemo>
<DsNotificationMemo variant='link'>Link notification banner alert.</DsNotificationMemo>
<DsNotificationMemo variant='info'>Info notification banner alert.</DsNotificationMemo>
<DsNotificationMemo variant='success'>Success! Your settings were saved successfully.</DsNotificationMemo>
<DsNotificationMemo variant='warning'>Warning! Please review your form inputs.</DsNotificationMemo>
<DsNotificationMemo variant='danger'>Danger! An error occurred while processing.</DsNotificationMemo>

// Dismissible Notifications
<DsNotificationMemo variant='primary' onDelete={() => {}} >Dismissible notification</DsTagMemo>`

  return (
    <div
      data-component='NotificationPage'
      className='w-full space-y-8 text-left'
    >
      <DsHeroMemo
        variant='default'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <>
          <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            ELEMENTS / NOTIFICATION
          </div>
          <DsTitleMemo
            size={2}
            className='mb-2 font-extrabold text-gray-900 dark:text-zinc-100'
          >
            Notification
          </DsTitleMemo>
          <p className='text-base text-gray-600 dark:text-zinc-400'>
            Bold notification banner boxes for user alerts, system feedback, and
            dismissible messages.
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
            <div className='w-full space-y-3'>
              <DsNotificationMemo variant='default'>
                Default notification banner alert.
              </DsNotificationMemo>
              <DsNotificationMemo variant='primary'>
                Primary notification banner alert.
              </DsNotificationMemo>
              <DsNotificationMemo variant='link'>
                Link notification banner alert.
              </DsNotificationMemo>
              <DsNotificationMemo variant='info'>
                Info notification banner alert.
              </DsNotificationMemo>
              <DsNotificationMemo variant='success'>
                Success! Your article was published successfully.
              </DsNotificationMemo>
              <DsNotificationMemo variant='warning'>
                Warning! Please review your form inputs before submitting.
              </DsNotificationMemo>
              <DsNotificationMemo variant='danger'>
                Danger! Could not save changes to backend API.
              </DsNotificationMemo>
            </div>
          ),
        })}

        {/* Section 2: Dismissible Notifications */}
        {sectionView({
          title: 'Dismissible Banners (with Delete button)',
          children: () => (
            <div className='w-full space-y-3'>
              <DsNotificationMemo
                variant='primary'
                onDelete={() => alert('Dismissed primary alert!')}
              >
                Primary notification with dismiss button
              </DsNotificationMemo>
              <DsNotificationMemo
                variant='info'
                onDelete={() => alert('Dismissed info alert!')}
              >
                Info notification with dismiss button
              </DsNotificationMemo>
              <DsNotificationMemo
                variant='success'
                onDelete={() => alert('Dismissed success alert!')}
              >
                Success notification with dismiss button
              </DsNotificationMemo>
              <DsNotificationMemo
                variant='danger'
                onDelete={() => alert('Dismissed danger alert!')}
              >
                Danger notification with dismiss button
              </DsNotificationMemo>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Notification Component Code
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
