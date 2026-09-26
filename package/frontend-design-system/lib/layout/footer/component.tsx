import { memo } from 'react'

import { cn } from '../../theme'
import { type FooterProps, FooterPropsEq } from './type'

const FooterComponent = ({ children, className, dataTest }: FooterProps) => {
  return (
    <footer
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
