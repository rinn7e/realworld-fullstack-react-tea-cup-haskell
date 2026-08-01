import React from 'react'

export type CardProps = {
  header?: React.ReactNode
  image?: React.ReactNode
  children: () => React.ReactNode
  footer?: React.ReactNode
  className?: string
}
