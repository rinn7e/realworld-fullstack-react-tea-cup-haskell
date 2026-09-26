import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import type React from 'react'
import type { ReactNode } from 'react'

export type ButtonColor =
  'white' | 'green' | 'dark-green' | 'sky' | 'amber' | 'red' | 'gray'

export type ButtonVariant = 'solid' | 'outline' | 'link' | 'ghost'

export type ButtonSize = 'xsmall' | 'small' | 'normal' | 'medium' | 'large'

export type ButtonProps = {
  color?: ButtonColor
  variant?: ButtonVariant
  size?: ButtonSize
  isRounded?: boolean
  isFullWidth?: boolean
  isLoading?: boolean
  isDisabled?: boolean
  children?: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  dataTest?: string
}

export const ButtonPropsEq: EqClass.Eq<ButtonProps> =
  EqClass.struct<ButtonProps>({
    color: UndefinableEq(string.Eq),
    variant: UndefinableEq(string.Eq),
    size: UndefinableEq(string.Eq),
    isRounded: UndefinableEq(boolean.Eq),
    isFullWidth: UndefinableEq(boolean.Eq),
    isLoading: UndefinableEq(boolean.Eq),
    isDisabled: UndefinableEq(boolean.Eq),
    children: EqClass.eqStrict,
    onClick: EqClass.eqStrict,
    type: UndefinableEq(string.Eq),
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
