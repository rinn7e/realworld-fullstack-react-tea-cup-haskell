import React from 'react'

import { cn } from '../../theme'
import { view as DeleteView } from '../delete/view'
import type { NotificationProps } from './type'

const variantStyles: Record<string, string> = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  primary: 'bg-emerald-500 text-white border-emerald-600',
  link: 'bg-emerald-600 text-white border-emerald-700',
  info: 'bg-sky-500 text-white border-sky-600',
  success: 'bg-green-500 text-white border-green-600',
  warning: 'bg-amber-400 text-gray-900 border-amber-500',
  danger: 'bg-rose-500 text-white border-rose-600',
}

export const view = ({
  variant = 'default',
  children,
  onDelete,
  className,
}: NotificationProps): React.ReactElement => {
  return (
    <div
      data-component='Notification'
      className={cn(
        'relative flex items-center justify-between rounded-xl border p-4 text-sm shadow-xs transition-all',
        variantStyles[variant] || variantStyles.default,
        className,
      )}
    >
      <div className='flex-1 pr-6'>{children()}</div>
      {onDelete && (
        <div className='absolute top-3 right-3'>
          {DeleteView({ size: 'small', onClick: onDelete })}
        </div>
      )}
    </div>
  )
}
