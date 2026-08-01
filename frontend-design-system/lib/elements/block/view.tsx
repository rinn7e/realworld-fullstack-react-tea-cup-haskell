import React from 'react'
import { cn } from '../../theme'
import type { BlockProps } from './type'

export const view: React.FC<BlockProps> = ({ children, className }) => {
  return <div className={cn('mb-6 last:mb-0', className)}>{children}</div>
}
