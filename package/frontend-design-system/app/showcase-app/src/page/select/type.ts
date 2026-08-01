export type Model = {
  showCode: boolean
  value: string
}

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'UpdateValue'; value: string }
