import React, { useContext } from 'react'

import { SetGlobalMsgContext } from '@/common/global-context'
import { type AppRoute } from '@/common/type/route'
import { toUrlString } from '@/common/util/route'

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  route: AppRoute
  className?: string
  children: React.ReactNode
}

export const Link: React.FC<Props> = ({
  route,
  className,
  children,
  onClick,
  ...rest
}) => {
  const setGlobalMsg = useContext(SetGlobalMsgContext)
  const href = toUrlString(route)

  return (
    <a
      {...rest}
      href={href}
      className={className}
      onClick={(e) => {
        if (onClick) onClick(e)
        if (
          !e.defaultPrevented &&
          e.button === 0 &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.shiftKey
        ) {
          e.preventDefault()
          setGlobalMsg({
            _tag: 'NavigationMsg',
            subMsg: { _tag: 'ChangeRoute', route },
          })
        }
      }}
    >
      {children}
    </a>
  )
}
