import React from 'react'

import { cn } from '../../theme'
import type { BoxProps } from './type'

export const view = ({
  children,
  className,
  key,
  dataTest,
}: BoxProps): React.ReactElement => {
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Box'
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-6 text-gray-800 shadow-xs transition-all hover:shadow-md',
        className,
      )}
    >
      {children()}
    </div>
  )
}
