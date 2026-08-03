import { Upload } from 'lucide-react'
import React, { memo } from 'react'

import { cn } from '../../theme'
import { FilePropsEq, type FileProps } from './type'

export const FileComponent: React.FC<FileProps> = ({
  filename,
  ctaText = 'Choose a file…',
  accept,
  isDisabled,
  onChange,
  name,
  id,
  className,
  key,
  dataTest,
}) => {
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='File'
      className={cn('inline-flex items-center gap-3', className)}
    >
      <label
        className={cn(
          'inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/20',
          isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        )}
      >
        <Upload className='h-4 w-4' />
        <span>{ctaText}</span>
        <input
          type='file'
          accept={accept}
          disabled={isDisabled}
          onChange={onChange}
          name={name}
          id={id}
          className='hidden'
        />
      </label>
      {filename && (
        <span className='max-w-xs truncate text-xs text-gray-600'>
          {filename}
        </span>
      )}
    </div>
  )
}

export const FileMemo = memo(FileComponent, FilePropsEq.equals)
