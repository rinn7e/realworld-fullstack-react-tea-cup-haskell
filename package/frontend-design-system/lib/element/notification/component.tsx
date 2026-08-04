import { memo } from 'react'
import React from 'react'

import { cn } from '../../theme'
import { DeleteMemo } from '../delete/component'
import {
  type NotificationColor,
  type NotificationProps,
  NotificationPropsEq,
} from './type'

const colorStyles: Record<NotificationColor, string> = {
  white:
    'bg-white text-gray-800 border-gray-200 dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800',
  green:
    'bg-green-600 text-white border-green-700 dark:bg-green-700 dark:border-green-800',
  'dark-green':
    'bg-green-700 text-white border-green-800 dark:bg-green-800 dark:border-green-900',
  sky: 'bg-sky-500 text-white border-sky-600 dark:bg-sky-600 dark:border-sky-700',
  amber:
    'bg-amber-500 text-white border-amber-600 dark:bg-amber-600 dark:border-amber-700',
  red: 'bg-red-600 text-white border-red-700 dark:bg-red-700 dark:border-red-800',
  gray: 'bg-gray-200 text-gray-800 border-gray-300 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-800',
}

export const NotificationComponent: React.FC<NotificationProps> = ({
  color = 'gray',
  children,
  onDelete,
  className,
  key,
  dataTest,
}) => {
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Notification'
      className={cn(
        'relative flex items-center justify-between rounded-xl border p-4 text-sm shadow-xs transition-all',
        colorStyles[color] || colorStyles.gray,
        className,
      )}
    >
      <div className='flex-1 pr-6'>{children}</div>
      {onDelete && (
        <div className='absolute top-3 right-3'>
          <DeleteMemo size='small' onClick={onDelete} />
        </div>
      )}
    </div>
  )
}

export const NotificationMemo = memo(
  NotificationComponent,
  NotificationPropsEq.equals,
)
