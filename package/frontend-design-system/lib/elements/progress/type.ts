export type ProgressVariant =
  'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'

export type ProgressSize = 'xsmall' | 'small' | 'normal' | 'medium' | 'large'

export type ProgressProps = {
  value?: number
  max?: number
  variant?: ProgressVariant
  size?: ProgressSize
  /**
   * NOTE: When `isIndeterminate` is set to true, this component functions as an
   * IndeterminateProgressBar, which is an extension beyond standard
   * CSS design system specifications.
   */
  isIndeterminate?: boolean
  className?: string
}
