import React from 'react'

export type TabItem = {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
}

export type Model = {
  activeId: string
}

export type Msg = { _tag: 'Select'; id: string }

export type TabsProps = {
  items: TabItem[]
  model: Model
  dispatch: (msg: Msg) => void
  isBoxed?: boolean
  isToggle?: boolean
  isFullWidth?: boolean
  className?: string
  key?: React.Key
  dataTest?: string
}
