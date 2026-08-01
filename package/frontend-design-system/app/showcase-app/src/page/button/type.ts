export type Model = {
  isLoading: boolean
  showCode: boolean
}

export type Msg = { _tag: 'ToggleLoading' } | { _tag: 'ToggleShowCode' }
