import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

export interface GenericLinkProps<PMsg>
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  className?: string
  dispatch: Dispatcher<PMsg>
  msg: PMsg
  children: React.ReactNode
}

export const GenericLink = <PMsg,>({
  href,
  className,
  dispatch,
  msg,
  children,
  ...rest
}: GenericLinkProps<PMsg>) => {
  return (
    <a
      {...rest}
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        dispatch(msg)
      }}
    >
      {children}
    </a>
  )
}
