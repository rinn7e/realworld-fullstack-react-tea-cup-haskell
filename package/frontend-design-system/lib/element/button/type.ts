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
  key?: React.Key
  dataTest?: string
}

export const ButtonPropsEq: EqClass.Eq<ButtonProps> = EqClass.struct<
  Required<ButtonProps>
>({
  color: string.Eq,
  variant: string.Eq,
  size: string.Eq,
  isRounded: boolean.Eq,
  isFullWidth: boolean.Eq,
  isLoading: boolean.Eq,
  isDisabled: boolean.Eq,
  children: EqClass.eqStrict,
  onClick: EqClass.eqStrict,
  type: string.Eq,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<ButtonProps>
