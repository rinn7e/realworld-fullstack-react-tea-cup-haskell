import React from 'react'

export type Model = {
  isOpen: boolean
}

export type Msg = { _tag: 'Open' } | { _tag: 'Close' }

export type ModalProps = {
  title?: string
  children: () => React.ReactNode
  footer?: React.ReactNode
  model: Model
  dispatch: (msg: Msg) => void
  className?: string
}
