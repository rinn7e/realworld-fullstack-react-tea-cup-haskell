import React from 'react'
import { cn } from '../../theme'
import type { LevelItemProps, LevelProps } from './type'

export const view = ({ children, className }: LevelProps): React.ReactElement => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-4 sm:flex-row',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const leftView = ({ children, className }: LevelProps): React.ReactElement => {
  return (
    <div className={cn('flex items-center gap-3', className)}>{children}</div>
  )
}

export const rightView = ({ children, className }: LevelProps): React.ReactElement => {
  return (
    <div className={cn('flex items-center gap-3', className)}>{children}</div>
  )
}

export const itemView = ({
  hasTextCentered = true,
  children,
  className,
}: LevelItemProps): React.ReactElement => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        hasTextCentered && 'text-center',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const LevelLeft = leftView
export const LevelRight = rightView
export const LevelItem = itemView
