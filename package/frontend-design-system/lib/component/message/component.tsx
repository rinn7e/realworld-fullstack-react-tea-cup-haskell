import React, { memo } from 'react'

import { DeleteMemo } from '../../element/delete/component'
import { cn } from '../../theme'
import type { MessageColor, MessageProps } from './type'
import { MessagePropsEq } from './type'

const colorStyles: Record<MessageColor, { header: string; body: string }> = {
  white: {
    header:
      'bg-white text-gray-800 border-gray-200 dark:bg-zinc-900 dark:text-zinc-100',
    body: 'bg-white text-gray-700 border-gray-200 dark:bg-zinc-950 dark:text-zinc-300 dark:border-zinc-800',
  },
  green: {
    header: 'bg-green-600 text-white dark:bg-green-700',
    body: 'bg-green-50/60 text-green-950 border-green-200 dark:bg-green-950/40 dark:text-green-200 dark:border-green-900/60',
  },
  'dark-green': {
    header: 'bg-green-800 text-white dark:bg-green-900',
    body: 'bg-green-100/60 text-green-950 border-green-300 dark:bg-green-950/60 dark:text-green-100 dark:border-green-800/60',
  },
  sky: {
    header: 'bg-sky-500 text-white dark:bg-sky-600',
    body: 'bg-sky-50/60 text-sky-950 border-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:border-sky-900/60',
  },
  amber: {
    header:
      'bg-amber-500 text-white font-bold dark:bg-amber-600 dark:text-white',
    body: 'bg-amber-50/60 text-amber-950 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900/60',
  },
  red: {
    header: 'bg-red-600 text-white dark:bg-red-700',
    body: 'bg-red-50/60 text-red-950 border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-900/60',
  },
  gray: {
    header: 'bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-zinc-100',
    body: 'bg-gray-50/70 text-gray-700 border-gray-200 dark:bg-zinc-950 dark:text-zinc-300 dark:border-zinc-800',
  },
}

export const MessageComponent = ({
  header,
  children,
  color = 'gray',
  onDelete,
  className,
  key,
  dataTest,
}: MessageProps): React.ReactElement => {
  const v = colorStyles[color] || colorStyles.gray
  const hasHeaderOrDelete = Boolean(header || onDelete)

  return (
    <article
      key={key}
      data-test={dataTest}
      data-component='Message'
      className={cn(
        'overflow-hidden rounded-lg border text-sm shadow-xs transition-colors',
        v.body,
        className,
      )}
    >
      {hasHeaderOrDelete && (
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2.5 font-bold',
            v.header,
          )}
        >
          <div>{header}</div>
          {onDelete && (
            <DeleteMemo size='small' onClick={onDelete} className='ml-auto' />
          )}
        </div>
      )}
      <div className='p-4'>{children}</div>
    </article>
  )
}

export const MessageMemo = memo(MessageComponent, MessagePropsEq.equals)
