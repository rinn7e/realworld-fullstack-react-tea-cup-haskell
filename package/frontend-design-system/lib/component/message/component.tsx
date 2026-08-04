import React, { memo } from 'react'

import { DeleteMemo } from '../../element/delete/component'
import { cn } from '../../theme'
import type { MessageProps } from './type'
import { MessagePropsEq } from './type'

const variantStyles: Record<string, { header: string; body: string }> = {
  default: {
    header: 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-slate-100',
    body: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800',
  },
  primary: {
    header: 'bg-emerald-600 text-white dark:bg-emerald-700',
    body: 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900/50',
  },
  info: {
    header: 'bg-sky-600 text-white dark:bg-sky-700',
    body: 'bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:border-sky-900/50',
  },
  success: {
    header: 'bg-green-600 text-white dark:bg-green-700',
    body: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-950/40 dark:text-green-200 dark:border-green-900/50',
  },
  warning: {
    header: 'bg-amber-500 text-gray-900 dark:bg-amber-600 dark:text-gray-950',
    body: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900/50',
  },
  danger: {
    header: 'bg-rose-600 text-white dark:bg-rose-700',
    body: 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900/50',
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

  return (
    <article
      key={key}
      data-test={dataTest}
      data-component='Message'
      className={cn(
        'overflow-hidden rounded-lg border text-sm',
        v.body,
        className,
      )}
    >
      {header && (
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2.5 font-semibold',
            v.header,
          )}
        >
          {onDelete && <DeleteMemo size='small' onClick={onDelete} />}
        </div>
      )}
      <div className='p-4'>{children}</div>
    </article>
  )
}

export const MessageMemo = memo(MessageComponent, MessagePropsEq.equals)
