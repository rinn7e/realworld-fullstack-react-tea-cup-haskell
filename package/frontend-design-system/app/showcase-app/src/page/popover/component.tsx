import * as DsPopover from '@rinn7e/realworld-design-system/component/popover'
import { PopoverMemo as DsPopoverMemo } from '@rinn7e/realworld-design-system/component/popover/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { ChevronDown, Code2, Sliders, Sparkles, User } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PopoverPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `<DsPopoverMemo
  model={model.popoverLeftModel}
  dispatch={(subMsg) => dispatch({ _tag: 'PopoverLeftMsg', subMsg })}
  trigger={
    <DsButtonMemo color='green' size='small' className='flex items-center gap-1.5'>
      <User size={16} />
      <span>User Account</span>
      <ChevronDown size={14} />
    </DsButtonMemo>
  }
  align='left'
  cardClassName='w-64'
>
  <div className='flex flex-col gap-1 text-sm p-1'>
    <button className='px-3 py-2 text-left rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900'>
      View Detailed Profile & Preferences
    </button>
  </div>
</DsPopoverMemo>`

  return (
    <div data-component='PopoverPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        variant='default'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <>
          <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            COMPONENTS / POPOVER
          </div>
          <DsTitleMemo
            size={2}
            className='mb-2 font-extrabold text-gray-900 dark:text-zinc-100'
          >
            Popover
          </DsTitleMemo>
          <p className='text-base text-gray-600 dark:text-zinc-400'>
            Floating popover component triggered by interactive elements with
            backdrop dismissal and alignment options.
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

        {sectionView({
          title: 'Left Aligned Popover (align="left")',
          children: () => (
            <div className='flex min-h-[140px] w-full items-start justify-center p-4'>
              <DsPopoverMemo
                model={model.popoverLeftModel}
                dispatch={(subMsg: DsPopover.Msg) =>
                  dispatch({ _tag: 'PopoverLeftMsg', subMsg })
                }
                trigger={
                  <DsButtonMemo
                    color='green'
                    size='small'
                    className='flex items-center gap-1.5'
                  >
                    <User size={16} />
                    <span>User</span>
                    <ChevronDown size={14} />
                  </DsButtonMemo>
                }
                align='left'
                cardClassName='w-64'
              >
                <div className='flex flex-col gap-1 text-sm'>
                  <button
                    type='button'
                    onClick={() =>
                      dispatch({
                        _tag: 'PopoverLeftMsg',
                        subMsg: { _tag: 'Close' },
                      })
                    }
                    className='flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-medium text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-900'
                  >
                    View Account Details
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      dispatch({
                        _tag: 'PopoverLeftMsg',
                        subMsg: { _tag: 'Close' },
                      })
                    }
                    className='flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-medium text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-900'
                  >
                    Settings & Preferences
                  </button>
                  <div className='my-1 border-t border-gray-100 dark:border-zinc-800' />
                  <button
                    type='button'
                    onClick={() =>
                      dispatch({
                        _tag: 'PopoverLeftMsg',
                        subMsg: { _tag: 'Close' },
                      })
                    }
                    className='flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                  >
                    Log Out
                  </button>
                </div>
              </DsPopoverMemo>
            </div>
          ),
        })}

        {sectionView({
          title: 'Right Aligned Popover (align="right")',
          children: () => (
            <div className='flex min-h-[140px] w-full items-start justify-center p-4'>
              <DsPopoverMemo
                model={model.popoverRightModel}
                dispatch={(subMsg: DsPopover.Msg) =>
                  dispatch({ _tag: 'PopoverRightMsg', subMsg })
                }
                trigger={
                  <DsButtonMemo
                    color='gray'
                    size='small'
                    className='flex items-center gap-1.5'
                  >
                    <Sliders size={16} />
                    <span>Filter</span>
                    <ChevronDown size={14} />
                  </DsButtonMemo>
                }
                align='right'
                cardClassName='w-64'
              >
                <div className='flex flex-col gap-1 text-sm'>
                  <button
                    type='button'
                    onClick={() =>
                      dispatch({
                        _tag: 'PopoverRightMsg',
                        subMsg: { _tag: 'Close' },
                      })
                    }
                    className='flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-medium text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-900'
                  >
                    Sort by Date Added
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      dispatch({
                        _tag: 'PopoverRightMsg',
                        subMsg: { _tag: 'Close' },
                      })
                    }
                    className='flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-medium text-gray-700 hover:bg-gray-100 dark:text-zinc-200 dark:hover:bg-zinc-900'
                  >
                    Sort by Popularity
                  </button>
                </div>
              </DsPopoverMemo>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Popover Component Code
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
