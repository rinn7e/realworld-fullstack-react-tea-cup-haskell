export type AnimateState =
  | { _tag: 'AnimateIn' }
  | { _tag: 'Visible' }
  | { _tag: 'AnimateOut' }
  | { _tag: 'Invisible' }

export type Animate<A> = {
  internal: A
  state: AnimateState
}
