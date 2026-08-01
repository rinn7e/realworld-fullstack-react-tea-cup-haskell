import { Button, Hero, Modal, Title } from '@rinn7e/realworld-design-system'
import { Code2, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}
export const ModalPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `{Button.view({
            color: 'green',
            variant: 'solid', onClick: () => dispatch({ _tag: 'ModalMsg', subMsg: { _tag: 'Open' } }), children: 'Open Modal' })}
{Modal.view({
  title: 'Confirm Delete',
  model: model.modalModel,
  dispatch: (subMsg) => dispatch({ _tag: 'ModalMsg', subMsg }),
  children: <p className='text-sm text-gray-600'>Are you sure you want to delete this article?</p>,
})}`
  return (
    <div data-component='ModalPage' className='w-full space-y-8 text-left'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className:
          'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: () => (
          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              COMPONENTS / MODAL
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: () => 'Modal',
            })}
            <p className='text-base text-gray-600'>
              Classic modal dialog overlay with header, body, and backdrop close
              controls.
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

        {sectionView({
          title: 'Modal Dialog Trigger',
          children: () => (
            <div className='flex w-full justify-center py-4'>
              <div>
                {Button.view({
                  color: 'green',
                  variant: 'solid',
                  onClick: () =>
                    dispatch({ _tag: 'ModalMsg', subMsg: { _tag: 'Open' } }),
                  children: () => 'Open Modal',
                })}
                {Modal.view({
                  title: 'Confirm Action',
                  model: model.modalModel,
                  dispatch: (subMsg) => dispatch({ _tag: 'ModalMsg', subMsg }),
                  children: () => (
                    <p className='text-sm text-gray-600'>
                      Are you sure you want to delete this article?
                    </p>
                  ),
                })}
              </div>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Modal Component Code</span>
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
