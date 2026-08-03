import { HeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { MessageMemo } from '@rinn7e/realworld-design-system/component/message/component'
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
export const MessagePage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// With Header & Body
{Message.view({ variant: 'default', header: 'Note', children: 'Standard message text content.' })}
{Message.view({ variant: 'primary', header: 'Primary Note', children: 'Primary callout message body.' })}
{Message.view({ variant: 'info', header: 'System Update', children: 'System maintenance scheduled.' })}
{Message.view({ variant: 'success', header: 'Success', children: 'Account setup complete.' })}
{Message.view({ variant: 'warning', header: 'Warning', children: 'Please verify your email.' })}
{Message.view({ variant: 'danger', header: 'Error', children: 'Failed to process transaction.' })}

// Body Only (No Header)
{Message.view({ variant: 'info', children: 'Standalone callout message body without a header.' })}

// Dismissible Message Callout
{Message.view({ variant: 'primary', header: 'Dismissible', onDelete: () => {}, children: 'Click X to dismiss.' })}`
  return (
    <div data-component='MessagePage' className='w-full space-y-8 text-left'>
      <HeroMemo variant="default" size="small" className="rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full" children={() => (<><div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              COMPONENTS / MESSAGE
            </div>
            <TitleMemo size={2} className='mb-2 font-extrabold text-gray-900' children={() => 'Message'} />
            <p className='text-base text-gray-600'>
              Callout message boxes with optional headers, color themes, and
              dismiss buttons.
            </p></>)} />

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <TitleMemo size={5} className="flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600" children={() => (<><Sparkles className="h-4 w-4 text-green-600" /><span>Interactive Playground &amp; Code</span></>)} />
          <ButtonMemo color="green" variant="link" size="small" onClick={() => dispatch({ _tag: "ToggleShowCode" })} className="flex items-center gap-1 font-semibold text-green-600 hover:underline" children={() => (<><Code2 className="h-3.5 w-3.5" /><span>{model.showCode ? "Hide Code" : "Show Code"}</span></>)} />
        </div>

        {/* Section 1: Color Variants with Headers */}
        {sectionView({
          title: 'Color Variants (Header & Body)',
          children: () => (
            <div className='w-full space-y-4'>
              <MessageMemo variant='default' header='Note'>
                {() =>
                  'Default callout message body detailing general instructions.'
                }
              </MessageMemo>
              <MessageMemo variant='primary' header='Primary Note'>
                {() =>
                  'Primary callout message highlighting important features.'
                }
              </MessageMemo>
              <MessageMemo variant='info' header='System Information'>
                {() =>
                  'Maintenance is scheduled for tonight at 02:00 UTC.'
                }
              </MessageMemo>
              <MessageMemo variant='success' header='Success'>
                {() =>
                  'Your account was upgraded to Pro successfully!'
                }
              </MessageMemo>
              <MessageMemo variant='warning' header='Warning'>
                {() =>
                  'Your subscription expires in 3 days. Please renew.'
                }
              </MessageMemo>
              <MessageMemo variant='danger' header='Connection Error'>
                {() =>
                  'Unable to reach backend servers. Please try again later.'
                }
              </MessageMemo>
            </div>
          ) })}

        {/* Section 2: Body Only & Dismissible Messages */}
        {sectionView({
          title: 'Body Only & Dismissible Messages',
          children: () => (
            <div className='w-full space-y-4'>
              <MessageMemo variant='info'>
                {() =>
                  'Standalone callout message body without a header container.'
                }
              </MessageMemo>
              <MessageMemo
                variant='primary'
                header='Dismissible Notice'
                onDelete={() => alert('Message closed!')}
              >
                {() =>
                  'Click the X button on the top right to close this message box.'
                }
              </MessageMemo>
            </div>
          ) })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Message Component Code</span>
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
