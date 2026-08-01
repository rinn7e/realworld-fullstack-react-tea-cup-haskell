import React from 'react'

export type FileProps = {
  filename?: string
  ctaText?: string
  accept?: string
  isDisabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  id?: string
  className?: string
  key?: React.Key
  dataTest?: string
}
