import type React from 'react'

import { cn } from '../../theme'
import type { BlockProps } from './type'

export const view = ({
  children,
  className,
}: BlockProps): React.ReactElement => {
  return (
    <div data-component='Block' className={cn('mb-6 last:mb-0', className)}>
      {children()}
    </div>
  )
}
