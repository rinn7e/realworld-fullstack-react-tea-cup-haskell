import { BoxMemo as DsBoxMemo } from '@rinn7e/realworld-design-system/element/box/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { memo } from 'react'

import { defaultDestination } from '@/common/type/destination'

import { type Props, PropsEq } from './type'

const NotFoundScreenComponent = ({ navigate }: Props) => {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      <DsBoxMemo className='flex max-w-md flex-col gap-4 p-10'>
        <>
          <DsTitleMemo size={1} className='font-extrabold text-green-600'>
            404
          </DsTitleMemo>
          <DsTitleMemo
            size={4}
            className='font-bold text-gray-800 dark:text-zinc-200'
          >
            Page Not Found
          </DsTitleMemo>
          <p className='text-sm text-gray-600 dark:text-zinc-400'>
            The component page you are looking for does not exist in our design
            system catalog.
          </p>
          <div className='pt-2'>
            <DsButtonMemo
              color='green'
              variant='solid'
              onClick={() => navigate(defaultDestination())}
            >
              Return to Home Overview
            </DsButtonMemo>
          </div>
        </>
      </DsBoxMemo>
    </div>
  )
}

export const NotFoundScreenMemo = memo(NotFoundScreenComponent, PropsEq.equals)
