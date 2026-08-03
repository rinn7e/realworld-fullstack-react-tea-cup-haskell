import type React from 'react'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as number from 'fp-ts/lib/number'
import * as string from 'fp-ts/lib/string'

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
  key?: React.Key
  dataTest?: string
}

export const ProgressPropsEq: EqClass.Eq<ProgressProps> = EqClass.struct<Required<ProgressProps>>({
  value: number.Eq,
  max: number.Eq,
  variant: string.Eq,
  size: string.Eq,
  isIndeterminate: boolean.Eq,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<ProgressProps>
