import React from 'react'

import { homePage } from '@/common/type/route'
import { Link } from '@/component/link'

export const NotFoundView: React.FC = () => {
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center px-[16px] text-center'>
      <div className='flex flex-col gap-[16px]'>
        <h1 className='text-9xl font-extrabold tracking-tighter text-green-600'>
          404
        </h1>
        <div className='flex flex-col gap-[8px]'>
          <h2 className='text-2xl font-bold text-gray-900'>Page Not Found</h2>
          <p className='max-w-[448px] text-gray-500'>
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className='pt-[16px]'>
          <Link
            route={{ page: homePage() }}
            className='inline-flex items-center justify-center rounded-md bg-green-600 px-[24px] py-[12px] text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:ring-1 focus-visible:ring-green-500 focus-visible:outline-none'
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
