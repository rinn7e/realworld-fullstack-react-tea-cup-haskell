import * as EqClass from 'fp-ts/lib/Eq'

export type AnimateState =
  | { _tag: 'AnimateIn' }
  | { _tag: 'Visible' }
  | { _tag: 'AnimateOut' }
  | { _tag: 'Invisible' }

export const AnimateStateEq: EqClass.Eq<AnimateState> = {
  equals: (x, y) => x._tag === y._tag,
}

export type Animate<A> = {
  internal: A
  state: AnimateState
}

export const getEq = <A>(eqA: EqClass.Eq<A>): EqClass.Eq<Animate<A>> =>
  EqClass.struct<Animate<A>>({
    internal: eqA,
    state: AnimateStateEq,
  })
