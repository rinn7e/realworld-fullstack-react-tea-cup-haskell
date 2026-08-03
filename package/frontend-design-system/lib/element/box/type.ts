import type React from 'react'

export type BoxProps = {
  children: () => React.ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}
