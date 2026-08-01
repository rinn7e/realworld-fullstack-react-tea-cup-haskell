import React from 'react'

export type InputSize = 'small' | 'normal' | 'medium' | 'large'

export type InputProps = {
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'
  value?: string
  placeholder?: string
  size?: InputSize
  isRounded?: boolean
  isFullWidth?: boolean
  isError?: boolean
  isDisabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  name?: string
  id?: string
  className?: string
  key?: React.Key
  dataTest?: string
}
