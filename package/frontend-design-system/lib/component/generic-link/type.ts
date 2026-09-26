import type React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

export type GenericLinkProps<PMsg> =
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    className?: string
    dispatch?: Dispatcher<PMsg>
    msg?: PMsg
    isNewTab?: boolean
    children: React.ReactNode
  }
