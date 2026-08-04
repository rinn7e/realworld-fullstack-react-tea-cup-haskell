import { cn } from '@rinn7e/tea-cup-prelude'
import React from 'react'

import { homePage } from '@/common/type/route'
import { Link } from '@/component/link'

export const Footer: React.FC = () => {
  return (
    <footer className='border-t border-gray-100 bg-gray-50 py-[24px] dark:border-zinc-800 dark:bg-zinc-950'>
      <div
        className={cn(
          // shared
          'mx-auto flex max-w-[1152px] flex-col items-center gap-[4px] px-[16px] text-center',
          // desktop
          'lg:flex-row lg:justify-between lg:text-left',
        )}
      >
        <Link
          route={{ page: homePage() }}
          className='text-sm font-bold text-green-600'
        >
          conduit
        </Link>
        <div className='flex flex-col gap-[4px] lg:items-end'>
          <span className='text-xs text-gray-400 dark:text-zinc-500'>
            An interactive learning project from{' '}
            <a
              href='https://thinkster.io'
              target='_blank'
              rel='noopener noreferrer'
              className='underline hover:text-gray-600 dark:hover:text-zinc-300'
            >
              Thinkster
            </a>
            . Code &amp; design licensed under MIT.
          </span>
          <span className='text-xs text-gray-400 dark:text-zinc-500'>
            Built using{' '}
            <a
              href='https://github.com/vankeisb/react-tea-cup'
              target='_blank'
              rel='noopener noreferrer'
              className='underline hover:text-gray-600 dark:hover:text-zinc-300'
            >
              react-tea-cup
            </a>
            , written by{' '}
            <a
              href='https://github.com/rinn7e'
              target='_blank'
              rel='noopener noreferrer'
              className='underline hover:text-gray-600 dark:hover:text-zinc-300'
            >
              rinn7e
            </a>
          </span>
          <span className='text-xs text-gray-400 dark:text-zinc-500'>
            Source code can be found{' '}
            <a
              href='https://github.com/rinn7e/tea-cup-realworld'
              target='_blank'
              rel='noopener noreferrer'
              className='underline hover:text-gray-600 dark:hover:text-zinc-300'
            >
              here
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
