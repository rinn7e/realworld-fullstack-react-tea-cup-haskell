import React from 'react'
import { Upload } from 'lucide-react'
import { cn } from '../../theme'
import type { FileProps } from './type'

export const view = ({
  filename,
  ctaText = 'Choose a file…',
  accept,
  isDisabled = false,
  onChange,
  name,
  id,
  className,
}: FileProps): React.ReactElement => {
  return (
    <label
      data-component='File'
      className={cn(
        'inline-flex items-center rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 focus-within:ring-2 focus-within:ring-emerald-500/20',
        isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      )}
    >
      <span className='inline-flex items-center gap-2 px-3.5 py-2 font-semibold text-emerald-600'>
        <Upload className='h-4 w-4' />
        <span>{ctaText}</span>
      </span>
      {filename && (
        <span className='max-w-xs truncate border-l border-gray-200 px-3.5 py-2 text-gray-500'>
          {filename}
        </span>
      )}
      <input
        type='file'
        name={name}
        id={id}
        accept={accept}
        disabled={isDisabled}
        onChange={onChange}
        className='sr-only'
      />
    </label>
  )
}
