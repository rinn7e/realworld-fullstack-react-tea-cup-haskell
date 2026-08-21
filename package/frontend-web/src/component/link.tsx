import type * as Navigation from '@rinn7e/tea-cup-navigation'
import { Link as NavLink } from '@rinn7e/tea-cup-navigation/component'
import React, { useContext } from 'react'

import { SetGlobalMsgContext } from '@/common/global-context'
import { type AppRoute, AppRouteEq, toUrlString } from '@/common/type/route'

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
      dispatch={(subMsg: Navigation.Msg<AppRoute>) =>
        dispatch({ _tag: 'NavigationMsg', subMsg })
      }
      routeEq={AppRouteEq}
      className={className}
    >
      {children}
    </NavLink>
  )
}
