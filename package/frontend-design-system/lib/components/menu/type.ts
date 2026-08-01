export type MenuItem = {
  id: string
  label: string
  isActive?: boolean
}

export type MenuCategory = {
  title: string
  items: MenuItem[]
}

export type Model = {
  activeId: string | null
}

export type Msg = { _tag: 'Select'; id: string }

export type MenuProps = {
  categories: MenuCategory[]
  model: Model
  dispatch: (msg: Msg) => void
  className?: string
}
