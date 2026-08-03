import { BoxMemo as DsBoxMemo } from '@rinn7e/realworld-design-system/element/box/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import React from 'react'

import type { AppRoute } from '../../route/type'

interface Props {
  navigateRoute: (route: AppRoute) => void
}

export const NotFoundPage: React.FC<Props> = ({ navigateRoute }) => {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      <DsBoxMemo
        className='p-10 max-w-md space-y-4'
        children={() => (
          <>
            <DsTitleMemo
              size={1}
              className='text-green-600 font-extrabold'
              children={() => '404'}
            />
            <DsTitleMemo
              size={4}
              className='text-gray-800 font-bold'
              children={() => 'Page Not Found'}
            />
            <p className='text-sm text-gray-600'>
              The component page you are looking for does not exist in our
              design system catalog.
            </p>
            <div className='pt-2'>
              <DsButtonMemo
                color='green'
                variant='solid'
                onClick={() => navigateRoute({ page: { _tag: 'HomePage' } })}
                children={() => 'Return to Home Overview'}
              />
            </div>
          </>
        )}
      />
    </div>
  )
}
