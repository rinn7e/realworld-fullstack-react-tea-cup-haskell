import React, { memo } from 'react'

import { cn } from '../../theme'
import { type FooterProps, FooterPropsEq } from './type'

export const FooterComponent: React.FC<FooterProps> = ({
  children,
  className,
  key,
  dataTest,
}) => {
  return (
    <footer
      key={key}
      data-test={dataTest}
      data-component='Footer'
      className={cn(
        'bg-white py-6 text-gray-500 dark:border-t dark:border-zinc-800 dark:bg-black dark:text-zinc-400',
        className,
      )}
    >
      {children?.()}
    </footer>
  )
}

export const FooterMemo = memo(FooterComponent, FooterPropsEq.equals)
