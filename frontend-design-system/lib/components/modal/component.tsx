import React from 'react'
import { view as DeleteView } from '../../elements/delete/view'
import { cn } from '../../theme'
import type { ModalProps } from './type'

export const view: React.FC<ModalProps> = ({
  title,
  children,
  footer,
  model,
  dispatch,
  className,
}) => {
  if (!model.isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Background Overlay */}
      <div
        onClick={() => dispatch({ _tag: 'Close' })}
        className='fixed inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity animate-in fade-in-0'
      />

      {/* Modal Content Box */}
      <div
        className={cn(
          'relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl transition-all animate-in zoom-in-95',
          className,
        )}
      >
        {title && (
          <div className='flex items-center justify-between border-b border-gray-100 px-6 py-4'>
            <h3 className='text-lg font-bold text-gray-900'>{title}</h3>
            <DeleteView size='medium' onClick={() => dispatch({ _tag: 'Close' })} />
          </div>
        )}
        <div className='p-6 text-sm text-gray-700'>{children}</div>
        {footer && (
          <div className='flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-3.5'>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export const ModalView = view
