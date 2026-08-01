import React from 'react'

export type RadioOption = {
  label: React.ReactNode
  value: string
}

export type RadioProps = {
  name: string
  options: RadioOption[]
  selectedValue?: string
  isDisabled?: boolean
  onChange?: (value: string) => void
  className?: string
}
