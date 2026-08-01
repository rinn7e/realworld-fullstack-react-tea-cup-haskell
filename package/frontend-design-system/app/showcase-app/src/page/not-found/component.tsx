import { Box, Button, Title } from '@rinn7e/realworld-design-system'
import React from 'react'

import type { AppRoute } from '../../route/type'

interface Props {
  navigateRoute: (route: AppRoute) => void
}

export const NotFoundPage: React.FC<Props> = ({ navigateRoute }) => {
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center'>
      {Box.view({
        className: 'p-10 max-w-md space-y-4',
        children: () => (
          <>
            {Title.view({
              size: 1,
              className: 'text-green-600 font-extrabold',
              children: () => '404',
            })}
            {Title.view({
              size: 4,
              className: 'text-gray-800 font-bold',
              children: () => 'Page Not Found',
            })}
            <p className='text-sm text-gray-600'>
              The component page you are looking for does not exist in our
              design system catalog.
            </p>
            <div className='pt-2'>
              {Button.view({
                color: 'green',
                variant: 'solid',
                onClick: () => navigateRoute({ page: { _tag: 'HomePage' } }),
                children: () => 'Return to Home Overview',
              })}
            </div>
          </>
        ),
      })}
    </div>
  )
}
