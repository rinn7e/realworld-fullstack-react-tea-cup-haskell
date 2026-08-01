export type Model = {
  activeTab: 'overview' | 'catalog'
}

export type Msg =
  { _tag: 'SelectTab'; tab: 'overview' | 'catalog' } | { _tag: 'NoOp' }
