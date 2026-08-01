import type React from 'react'

export type DropdownItem = {
  id: string
  label: string
  isDivider?: boolean
}

export type Model = {
  isOpen: boolean
  selectedId: string | null
}

export type Msg =
  { _tag: 'Toggle' } | { _tag: 'Close' } | { _tag: 'Select'; id: string }

export type DropdownProps = {
  triggerLabel: string
  items: DropdownItem[]
  model: Model
  dispatch: (msg: Msg) => void
  className?: string
  key?: React.Key
  dataTest?: string
}
