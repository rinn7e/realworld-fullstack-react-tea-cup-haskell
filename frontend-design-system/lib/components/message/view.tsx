import React from 'react'
import { view as DeleteView } from '../../elements/delete/view'
import { cn } from '../../theme'
import type { MessageProps } from './type'

const variantStyles: Record<string, { header: string; body: string }> = {
  default: {
    header: 'bg-gray-200 text-gray-800',
    body: 'bg-gray-50 text-gray-700 border-gray-200',
  },
  primary: {
    header: 'bg-emerald-600 text-white',
    body: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  },
  info: {
    header: 'bg-sky-600 text-white',
    body: 'bg-sky-50 text-sky-900 border-sky-200',
  },
  success: {
    header: 'bg-green-600 text-white',
    body: 'bg-green-50 text-green-900 border-green-200',
  },
  warning: {
    header: 'bg-amber-500 text-gray-900',
    body: 'bg-amber-50 text-amber-900 border-amber-200',
  },
  danger: {
    header: 'bg-rose-600 text-white',
    body: 'bg-rose-50 text-rose-900 border-rose-200',
  },
}

export const view: React.FC<MessageProps> = ({
  header,
  children,
  variant = 'default',
  onDelete,
  className,
}) => {
  const v = variantStyles[variant] || variantStyles.default

  return (
    <article
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
          <span>{header}</span>
          {onDelete && <DeleteView size='small' onClick={onDelete} />}
        </div>
      )}
      <div className='p-4'>{children}</div>
    </article>
  )
}
