import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as number from 'fp-ts/lib/number'
import * as string from 'fp-ts/lib/string'

export type ProgressColor =
  'white' | 'green' | 'dark-green' | 'sky' | 'amber' | 'red' | 'gray'

export type ProgressSize = 'xsmall' | 'small' | 'normal' | 'medium' | 'large'

export type ProgressProps = {
  value?: number
  max?: number
  color?: ProgressColor
  size?: ProgressSize
  /**
   * NOTE: When `isIndeterminate` is set to true, this component functions as an
   * IndeterminateProgressBar, which is an extension beyond standard
   * CSS design system specifications.
   */
  isIndeterminate?: boolean
  className?: string
  dataTest?: string
}

export const ProgressPropsEq: EqClass.Eq<ProgressProps> =
  EqClass.struct<ProgressProps>({
    value: UndefinableEq(number.Eq),
    max: UndefinableEq(number.Eq),
    color: UndefinableEq(string.Eq),
    size: UndefinableEq(string.Eq),
    isIndeterminate: UndefinableEq(boolean.Eq),
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
