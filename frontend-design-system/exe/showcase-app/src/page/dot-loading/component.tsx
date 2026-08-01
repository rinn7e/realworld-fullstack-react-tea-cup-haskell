import { Box, DotLoading, Title } from '@rinn7e/realworld-design-system'
import React from 'react'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: (msg: Msg) => void
}

export const DotLoadingPage: React.FC<Props> = () => {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <div>
        <span className='text-xs font-semibold tracking-wider text-green-600 uppercase'>
          MISC / DOT LOADING
        </span>
        {Title.view({
          size: 3,
          children: 'Dot Loading',
          className: 'mt-1 mb-2',
        })}
        <p className='text-gray-500'>
          Subtle inline text 3-dot loading animation element.
        </p>
      </div>

      {Box.view({
        children: (
          <div className='flex flex-col gap-4 p-4'>
            <div className='flex items-center gap-2 text-lg text-gray-700'>
              Loading content <DotLoading.view />
            </div>
            <div className='flex items-center gap-2 text-sm font-medium text-green-600'>
              Fetching data <DotLoading.view className='text-green-600' />
            </div>
          </div>
        ),
      })}
    </div>
  )
}
