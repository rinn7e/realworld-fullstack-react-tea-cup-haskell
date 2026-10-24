import React, { useContext } from 'react'

import { SetGlobalMsgContext } from '@/common/global-context'
import { type AppRoute, toUrlString } from '@/common/type/route'

// Not memoized: `children` is arbitrary JSX, which has no meaningful Eq
export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  route: AppRoute
  className?: string
  children: React.ReactNode
}

// A real `href` keeps open-in-new-tab and copy-link working; a plain left click
// navigates inside the app instead of reloading the page
export const Link = ({
  route,
  className,
  children,
  onClick,
  ...rest
}: LinkProps) => {
  const setGlobalMsg = useContext(SetGlobalMsgContext)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey
    ) {
      e.preventDefault()
      setGlobalMsg({ _tag: 'Navigate', route })
    }
  }

  return (
    <a
      {...rest}
      href={toUrlString(route)}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
