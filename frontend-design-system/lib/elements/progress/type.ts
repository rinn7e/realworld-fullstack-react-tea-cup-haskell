export type ProgressVariant =
  | 'primary'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export type ProgressSize = 'small' | 'normal' | 'medium' | 'large'

export type ProgressProps = {
  value?: number
  max?: number
  variant?: ProgressVariant
  size?: ProgressSize
  /**
   * NOTE: When `isIndeterminate` is set to true, this component functions as an
   * IndeterminateProgressBar, which is a custom non-Bulma extension beyond standard
   * Bulma CSS design system specifications.
   */
  isIndeterminate?: boolean
  className?: string
}
