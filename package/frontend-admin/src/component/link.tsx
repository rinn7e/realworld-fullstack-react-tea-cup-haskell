import type * as TeaRouter from '@rinn7e/tea-cup-router'
import { Link as RouterLink } from '@rinn7e/tea-cup-router/link/component'
import React, { useContext } from 'react'

import { SetGlobalMsgContext } from '@/common/global-context'
import { type AppRoute, AppRouteEq, toUrlString } from '@/common/type/route'

// Not memoized: `children` is arbitrary JSX, which has no meaningful Eq
export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  route: AppRoute
  className?: string
  children: React.ReactNode
}

export const Link = ({ route, className, children, ...rest }: LinkProps) => {
  const setGlobalMsg = useContext(SetGlobalMsgContext)

  return (
    <RouterLink
      {...rest}
      route={route}
      toUrl={toUrlString}
      dispatch={(subMsg: TeaRouter.Msg<AppRoute>) =>
        setGlobalMsg({ _tag: 'TeaRouterMsg', subMsg })
      }
      routeEq={AppRouteEq}
      className={className}
    >
      {children}
    </RouterLink>
  )
}
