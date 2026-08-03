import { SelectMemo as DsSelectMemo } from '@rinn7e/realworld-design-system/form/select/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
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
export const SelectPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `{<DsSelectMemo
  value: model.value,
  options: [
    { label: 'React 19 Frontend', value: 'react' },
    { label: 'Haskell Servant Backend', value: 'haskell' },
    { label: 'Elm Architecture State', value: 'elm' },
  ],
  onChange: (e) => dispatch({ _tag: 'UpdateValue', value: e.target.value }) })}`
  return (
    <div data-component='SelectPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo variant="default" size="small" className="rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full">
<><div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              FORM / SELECT
            </div>
            <DsTitleMemo size={2} className='mb-2 font-extrabold text-gray-900'>Select</DsTitleMemo>
            <p className='text-base text-gray-600'>
              Custom dropdown selection input control with options, sizes, and
              states.
            </p></>
</DsHeroMemo>

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <DsTitleMemo size={5} className="flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600"><><Sparkles className="h-4 w-4 text-green-600" /><span>Interactive Playground &amp; Code</span></></DsTitleMemo>
          <DsButtonMemo color="green" variant="link" size="small" onClick={() => dispatch({ _tag: "ToggleShowCode" })} className="flex items-center gap-1 font-semibold text-green-600 hover:underline">
            <Code2 className="h-3.5 w-3.5" />
            <span>{model.showCode ? "Hide Code" : "Show Code"}</span>
          </DsButtonMemo>
        </div>

        {/* Section 1: Dropdown Selection */}
        {sectionView({
          title: 'Interactive Select Dropdown',
          children: () => (
            <div className='w-full space-y-3'>
              <DsSelectMemo
                value={model.value || 'react'}
                options={[
                  { label: 'React 19 Frontend', value: 'react' },
                  { label: 'Haskell Servant Backend', value: 'haskell' },
                  { label: 'Elm Architecture State Machine', value: 'elm' },
                ]}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  dispatch({ _tag: 'UpdateValue', value: e.target.value })
                }
              />
              <p className='text-xs text-gray-500'>
                Selected Value:{' '}
                <span className='font-mono font-bold text-gray-800'>
                  {model.value || 'react'}
                </span>
              </p>
            </div>
          ) })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Select Component Code</span>
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
