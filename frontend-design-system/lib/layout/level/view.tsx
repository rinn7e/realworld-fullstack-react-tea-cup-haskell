import React from 'react'
import { cn } from '../../theme'
import type { LevelItemProps, LevelProps } from './type'

export const view: React.FC<LevelProps> = ({ children, className }) => {
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

export const leftView: React.FC<LevelProps> = ({ children, className }) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>{children}</div>
  )
}

export const rightView: React.FC<LevelProps> = ({ children, className }) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>{children}</div>
  )
}

export const itemView: React.FC<LevelItemProps> = ({
  hasTextCentered = true,
  children,
  className,
}) => {
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

// Named alias exports for convenience
export const LevelLeft = leftView
export const LevelRight = rightView
export const LevelItem = itemView
