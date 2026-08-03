import React, { memo } from 'react'

import { DeleteMemo } from '../../element/delete/component'
import { cn } from '../../theme'
import type { ModalProps } from './type'
import { ModalPropsEq } from './type'

export const ModalComponent = ({
  title,
  children,
  footer,
  model,
  dispatch,
  className,
  key,
  dataTest,
}: ModalProps): React.ReactElement | null => {
  if (!model.isOpen) {
    return null
  }

  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Modal'
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
    >
      <div
        className='fixed inset-0 cursor-pointer bg-gray-900/60 backdrop-blur-xs transition-opacity'
        onClick={() => dispatch({ _tag: 'Close' })}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl transition-all',
          className,
        )}
      >
        {title && (
          <div className='flex items-center justify-between border-b border-gray-100 px-6 py-4'>
            <h3 className='text-lg font-bold text-gray-900'>{title}</h3>
            <DeleteMemo
              size='normal'
              onClick={() => dispatch({ _tag: 'Close' })}
            />
          </div>
        )}
        <div className='p-6'>{children}</div>
        {footer && (
          <div className='flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4'>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export const ModalMemo = memo(ModalComponent, ModalPropsEq.equals)
