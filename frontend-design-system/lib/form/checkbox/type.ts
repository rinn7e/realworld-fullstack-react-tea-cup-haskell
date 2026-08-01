import React from 'react'

export type CheckboxProps = {
  label?: React.ReactNode
  checked?: boolean
  isDisabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  id?: string
  className?: string
}
