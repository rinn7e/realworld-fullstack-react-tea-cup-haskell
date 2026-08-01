import React from 'react'

export type SelectOption = {
  label: string
  value: string
}

export type SelectProps = {
  options: SelectOption[]
  value?: string
  isDisabled?: boolean
  isMultiple?: boolean
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  name?: string
  className?: string
  key?: React.Key
  dataTest?: string
}
