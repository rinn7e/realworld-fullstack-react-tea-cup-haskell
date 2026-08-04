import * as DsModal from '@rinn7e/realworld-design-system/component/modal'
import { ModalMemo as DsModalMemo } from '@rinn7e/realworld-design-system/component/modal/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { ImageMemo as DsImageMemo } from '@rinn7e/realworld-design-system/element/image/component'
import { TagMemo as DsTagMemo } from '@rinn7e/realworld-design-system/element/tag/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import {
  AlertTriangle,
  CheckCircle,
  Code2,
  Info,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const ModalPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Rich Content Modal with Header, Image, Badges & Footer Action Buttons
<DsModalMemo
  title='Publish Article Preview'
  model={model.modalRichModel}
  dispatch={(subMsg) => dispatch({ _tag: 'ModalRichMsg', subMsg })}
  footer={
    <>
      <DsButtonMemo
        color='gray'
        onClick={() => dispatch({ _tag: 'ModalRichMsg', subMsg: { _tag: 'Close' } })}
      >
        Cancel
      </DsButtonMemo>
      <DsButtonMemo
        color='green'
        onClick={() => dispatch({ _tag: 'ModalRichMsg', subMsg: { _tag: 'Close' } })}
      >
        Publish Now
      </DsButtonMemo>
    </>
  }
>
  <div className='space-y-4'>
    <DsImageMemo
      src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
      alt='Code Preview'
      ratio='16by9'
    />
    <div className='flex gap-2'>
      <DsTagMemo color='green'>React 19</DsTagMemo>
      <DsTagMemo color='sky'>TEA Architecture</DsTagMemo>
    </div>
    <p className='text-sm text-gray-600 dark:text-zinc-400'>
      Your article is ready to be published to the global showcase feed.
    </p>
  </div>
</DsModalMemo>`

  return (
    <div data-component='ModalPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        color='gray'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <>
          <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            COMPONENTS / MODAL
          </div>
          <DsTitleMemo
            size={2}
            className='mb-2 font-extrabold text-gray-900 dark:text-zinc-100'
          >
            Modal
          </DsTitleMemo>
          <p className='text-base text-gray-600 dark:text-zinc-400'>
            Classic modal dialog overlay with header title, rich body content
            (images, badges, typography), and footer action controls.
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
          title:
            'Rich Content Modal (Image, Badges, Typography & Footer Actions)',
          children: () => (
            <div className='flex w-full justify-center py-4'>
              <div>
                <DsButtonMemo
                  color='green'
                  className='flex items-center gap-2'
                  onClick={() =>
                    dispatch({
                      _tag: 'ModalRichMsg',
                      subMsg: { _tag: 'Open' },
                    })
                  }
                >
                  <Upload size={16} />
                  <span>Publish Article Preview</span>
                </DsButtonMemo>

                <DsModalMemo
                  title='Publish Article Preview'
                  model={model.modalRichModel}
                  dispatch={(subMsg: DsModal.Msg) =>
                    dispatch({ _tag: 'ModalRichMsg', subMsg })
                  }
                  footer={
                    <>
                      <DsButtonMemo
                        color='gray'
                        onClick={() =>
                          dispatch({
                            _tag: 'ModalRichMsg',
                            subMsg: { _tag: 'Close' },
                          })
                        }
                      >
                        Cancel
                      </DsButtonMemo>
                      <DsButtonMemo
                        color='green'
                        className='flex items-center gap-1.5'
                        onClick={() =>
                          dispatch({
                            _tag: 'ModalRichMsg',
                            subMsg: { _tag: 'Close' },
                          })
                        }
                      >
                        <CheckCircle size={16} />
                        <span>Publish Now</span>
                      </DsButtonMemo>
                    </>
                  }
                >
                  <div className='space-y-4 text-left'>
                    <div className='overflow-hidden rounded-lg border border-gray-100 dark:border-zinc-800'>
                      <DsImageMemo
                        src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
                        alt='Code preview'
                        ratio='16by9'
                      />
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      <DsTagMemo color='green'>React 19</DsTagMemo>
                      <DsTagMemo color='sky'>TEA Architecture</DsTagMemo>
                      <DsTagMemo color='amber'>Design System</DsTagMemo>
                    </div>
                    <p className='text-sm leading-relaxed text-gray-700 dark:text-zinc-300'>
                      You are about to publish{' '}
                      <strong>
                        &quot;Building Component-Driven Web Apps in React&quot;
                      </strong>
                      . This article will be visible to all members of your
                      organization.
                    </p>
                    <div className='flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50/60 p-3 text-xs text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200'>
                      <Info
                        size={16}
                        className='shrink-0 text-blue-600 dark:text-blue-400'
                      />
                      <span>
                        Notification emails will automatically be dispatched to
                        subscribers upon publishing.
                      </span>
                    </div>
                  </div>
                </DsModalMemo>
              </div>
            </div>
          ),
        })}

        {sectionView({
          title: 'Danger Confirmation Modal',
          children: () => (
            <div className='flex w-full justify-center py-4'>
              <div>
                <DsButtonMemo
                  color='red'
                  className='flex items-center gap-2'
                  onClick={() =>
                    dispatch({
                      _tag: 'ModalDangerMsg',
                      subMsg: { _tag: 'Open' },
                    })
                  }
                >
                  <Trash2 size={16} />
                  <span>Delete Article</span>
                </DsButtonMemo>

                <DsModalMemo
                  title='Delete Article Confirmation'
                  model={model.modalDangerModel}
                  dispatch={(subMsg: DsModal.Msg) =>
                    dispatch({ _tag: 'ModalDangerMsg', subMsg })
                  }
                  footer={
                    <>
                      <DsButtonMemo
                        color='gray'
                        onClick={() =>
                          dispatch({
                            _tag: 'ModalDangerMsg',
                            subMsg: { _tag: 'Close' },
                          })
                        }
                      >
                        Keep Article
                      </DsButtonMemo>
                      <DsButtonMemo
                        color='red'
                        className='flex items-center gap-1.5'
                        onClick={() =>
                          dispatch({
                            _tag: 'ModalDangerMsg',
                            subMsg: { _tag: 'Close' },
                          })
                        }
                      >
                        <AlertTriangle size={16} />
                        <span>Confirm Permanent Delete</span>
                      </DsButtonMemo>
                    </>
                  }
                >
                  <div className='space-y-3 text-left'>
                    <div className='flex items-start gap-2.5 rounded-lg border border-rose-100 bg-rose-50/60 p-3 text-xs text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200'>
                      <AlertTriangle
                        size={16}
                        className='shrink-0 text-rose-600 dark:text-rose-400'
                      />
                      <span>
                        Warning: This action cannot be undone and will erase all
                        comments &amp; stats.
                      </span>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-zinc-400'>
                      Are you sure you want to permanently delete{' '}
                      <strong>
                        &quot;Building Component-Driven Web Apps in React&quot;
                      </strong>
                      ?
                    </p>
                  </div>
                </DsModalMemo>
              </div>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Modal Component Code
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
