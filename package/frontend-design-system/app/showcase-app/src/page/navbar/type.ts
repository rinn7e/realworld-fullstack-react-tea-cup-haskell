export type Model = {
  showCode: boolean
}

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'NavbarMsg'; msg: string }
