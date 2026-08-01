export type Model = {
  showCode: boolean
  checked: boolean
}

export type Msg = { _tag: 'ToggleShowCode' } | { _tag: 'ToggleChecked' }
