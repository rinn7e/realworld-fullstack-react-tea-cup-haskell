import React from 'react'

export type SectionSize = 'medium' | 'large'

export type SectionProps = {
  children: () => React.ReactNode
  size?: SectionSize
  className?: string
  key?: React.Key
  dataTest?: string
}
