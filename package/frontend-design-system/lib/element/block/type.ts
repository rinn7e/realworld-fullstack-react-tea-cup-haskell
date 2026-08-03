import type React from 'react'

export type BlockProps = {
  children: () => React.ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}
