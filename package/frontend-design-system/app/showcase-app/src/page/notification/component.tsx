import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { NotificationMemo as DsNotificationMemo } from '@rinn7e/realworld-design-system/element/notification/component'
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

export const NotificationPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Standard Notifications
<DsNotificationMemo variant='default' children={() => 'Default notification banner alert.'} />
<DsNotificationMemo variant='primary' children={() => 'Primary notification banner alert.'} />
<DsNotificationMemo variant='link' children={() => 'Link notification banner alert.'} />
<DsNotificationMemo variant='info' children={() => 'Info notification banner alert.'} />
<DsNotificationMemo variant='success' children={() => 'Success! Your settings were saved successfully.'} />
<DsNotificationMemo variant='warning' children={() => 'Warning! Please review your form inputs.'} />
<DsNotificationMemo variant='danger' children={() => 'Danger! An error occurred while processing.'} />

// Dismissible Notifications
<DsNotificationMemo variant='primary' onDelete={() => {}} children={() => 'Dismissible notification'} />`

  return (
    <div
      data-component='NotificationPage'
      className='w-full space-y-8 text-left'
    >
      <DsHeroMemo variant="default" size="small" className="rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full" children={() => (<><div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              ELEMENTS / NOTIFICATION
            </div>
            <DsTitleMemo
              size={2}
              className='mb-2 font-extrabold text-gray-900'
              children={() => 'Notification'}
            />
            <p className='text-base text-gray-600'>
              Bold notification banner boxes for user alerts, system feedback,
              and dismissible messages.
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

        {/* Section 1: Color Variants */}
        {sectionView({
          title: 'Color Variants',
          children: () => (
            <div className='w-full space-y-3'>
              <DsNotificationMemo
                variant='default'
                children={() => 'Default notification banner alert.'}
              />
              <DsNotificationMemo
                variant='primary'
                children={() => 'Primary notification banner alert.'}
              />
              <DsNotificationMemo
                variant='link'
                children={() => 'Link notification banner alert.'}
              />
              <DsNotificationMemo
                variant='info'
                children={() => 'Info notification banner alert.'}
              />
              <DsNotificationMemo
                variant='success'
                children={() =>
                  'Success! Your article was published successfully.'
                }
              />
              <DsNotificationMemo
                variant='warning'
                children={() =>
                  'Warning! Please review your form inputs before submitting.'
                }
              />
              <DsNotificationMemo
                variant='danger'
                children={() =>
                  'Danger! Could not save changes to backend API.'
                }
              />
            </div>
          ) })}

        {/* Section 2: Dismissible Notifications */}
        {sectionView({
          title: 'Dismissible Banners (with Delete button)',
          children: () => (
            <div className='w-full space-y-3'>
              <DsNotificationMemo
                variant='primary'
                onDelete={() => alert('Dismissed primary alert!')}
                children={() => 'Primary notification with dismiss button'}
              />
              <DsNotificationMemo
                variant='info'
                onDelete={() => alert('Dismissed info alert!')}
                children={() => 'Info notification with dismiss button'}
              />
              <DsNotificationMemo
                variant='success'
                onDelete={() => alert('Dismissed success alert!')}
                children={() => 'Success notification with dismiss button'}
              />
              <DsNotificationMemo
                variant='danger'
                onDelete={() => alert('Dismissed danger alert!')}
                children={() => 'Danger notification with dismiss button'}
              />
            </div>
          ) })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Notification Component Code</span>
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
