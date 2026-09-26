import type { GenericLinkProps } from './type'

export const GenericLink = <PMsg,>({
  href,
  className,
  dispatch,
  msg,
  isNewTab,
  children,
  ...rest
}: GenericLinkProps<PMsg>) => {
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
        } else if (msg === undefined) {
          // when msg is undefined, call href directly (normal browser navigation)
        } else {
          e.preventDefault()
          if (dispatch) {
            dispatch(msg)
          }
        }
      }}
    >
      {children}
    </a>
  )
}
