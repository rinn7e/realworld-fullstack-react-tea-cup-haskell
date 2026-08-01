import React from 'react'

export type MediaObjectProps = {
  left?: React.ReactNode
  children: () => React.ReactNode
  right?: React.ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}
