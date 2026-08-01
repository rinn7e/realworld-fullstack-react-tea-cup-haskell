import React from 'react'

export type PanelTab = {
  id: string
  label: string
}

export type PanelBlockItem = {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
}

export type Model = {
  activeTabId: string
  selectedItemId: string | null
}

export type Msg =
  | { _tag: 'SelectTab'; id: string }
  | { _tag: 'SelectItem'; id: string }

export type PanelProps = {
  heading: React.ReactNode
  tabs?: PanelTab[]
  blocks: PanelBlockItem[]
  model: Model
  dispatch: (msg: Msg) => void
  className?: string
}
