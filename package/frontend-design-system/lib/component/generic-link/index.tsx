import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

export interface Props<
  PMsg,
> extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
  className?: string
  dispatch?: Dispatcher<PMsg>
  msg?: PMsg
  isNewTab?: boolean
  children: React.ReactNode
}

export type GenericLinkProps<PMsg> = Props<PMsg>

export const GenericLink = <PMsg,>({
  href,
  className,
  dispatch,
  msg,
  isNewTab,
  children,
  ...rest
}: Props<PMsg>) => {
  if (href === undefined) {
    return (
      <button
        type='button'
        {...(rest as unknown as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        className={className}
        onClick={() => {
          if (msg !== undefined && dispatch) {
            dispatch(msg)
          }
        }}
      >
        {children}
      </button>
    )
  }

  return (
    <a
      {...rest}
      href={href}
      className={className}
      target={isNewTab ? '_blank' : rest.target}
      rel={isNewTab ? 'noopener noreferrer' : rest.rel}
      onClick={(e) => {
        if (isNewTab) {
          e.preventDefault()
          window.open(href, '_blank', 'noopener,noreferrer')
          if (msg !== undefined && dispatch) {
            dispatch(msg)
          }
          return
        }

        if (msg === undefined) {
          // when msg is undefined, call href directly (normal browser navigation)
          return
        }

        e.preventDefault()
        if (dispatch) {
          dispatch(msg)
        }
      }}
    >
      {children}
    </a>
  )
}
