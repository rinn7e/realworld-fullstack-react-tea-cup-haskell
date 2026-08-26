import type * as TeaRouter from '@rinn7e/tea-cup-router'
import { Link as NavLink } from '@rinn7e/tea-cup-router/link/component'
import React, { useContext } from 'react'

import { SetGlobalMsgContext } from '@/common/global-context'
import { type AppRoute, AppRouteEq, toUrlString } from '@/common/type/route'
import { TeaRouterMsg } from '@/type'

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  route: AppRoute
  className?: string
  children: React.ReactNode
}

export const Link: React.FC<Props> = ({
  route,
  className,
  children,
  ...rest
}) => {
  const dispatch = useContext(SetGlobalMsgContext)

  return (
    <NavLink
      {...rest}
      route={route}
      toUrl={toUrlString}
      dispatch={(subMsg: TeaRouter.Msg<AppRoute>) =>
        dispatch(TeaRouterMsg(subMsg))
      }
      routeEq={AppRouteEq}
      className={className}
    >
      {children}
    </NavLink>
  )
}
