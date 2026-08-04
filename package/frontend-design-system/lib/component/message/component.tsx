import React, { memo } from 'react'

import { DeleteMemo } from '../../element/delete/component'
import { cn } from '../../theme'
import type { MessageProps } from './type'
import { MessagePropsEq } from './type'

const variantStyles: Record<string, { header: string; body: string }> = {
  default: {
    header: 'bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-zinc-100',
    body: 'bg-gray-50/70 text-gray-700 border-gray-200 dark:bg-zinc-950 dark:text-zinc-300 dark:border-zinc-800',
  },
  primary: {
    header: 'bg-emerald-600 text-white dark:bg-emerald-700',
    body: 'bg-emerald-50/60 text-emerald-950 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900/60',
  },
  info: {
    header: 'bg-sky-500 text-white dark:bg-sky-600',
    body: 'bg-sky-50/60 text-sky-950 border-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:border-sky-900/60',
  },
  success: {
    header: 'bg-green-600 text-white dark:bg-green-700',
    body: 'bg-green-50/60 text-green-950 border-green-200 dark:bg-green-200/20 dark:text-green-200 dark:border-green-900/60',
  },
  warning: {
    header:
      'bg-amber-500 text-amber-950 font-bold dark:bg-amber-600 dark:text-amber-950',
    body: 'bg-amber-50/60 text-amber-950 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900/60',
  },
  danger: {
    header: 'bg-rose-600 text-white dark:bg-rose-700',
    body: 'bg-rose-50/60 text-rose-950 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900/60',
  },
}

export const MessageComponent = ({
  header,
  children,
  variant = 'default',
  onDelete,
  className,
  key,
  dataTest,
}: MessageProps): React.ReactElement => {
  const v = variantStyles[variant] || variantStyles.default
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
