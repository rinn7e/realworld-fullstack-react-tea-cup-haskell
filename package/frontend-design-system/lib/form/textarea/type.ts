import React from 'react'

export type TextareaProps = {
  value?: string
  placeholder?: string
  rows?: number
  isError?: boolean
  isDisabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  name?: string
  id?: string
  className?: string
}
