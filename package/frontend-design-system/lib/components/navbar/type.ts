import React from 'react'

export type NavbarItem = {
  id: string
  label: React.ReactNode
  href?: string
  isActive?: boolean
}

export type Model = {
  isBurgerOpen: boolean
  activeId: string | null
}

export type Msg =
  | { _tag: 'ToggleBurger' }
  | { _tag: 'SelectTab'; id: string }

export type NavbarProps = {
  brand: React.ReactNode
  startItems?: NavbarItem[]
  endItems?: NavbarItem[]
  model: Model
  dispatch: (msg: Msg) => void
  onNavigate?: (id: string) => void
  className?: string
}
