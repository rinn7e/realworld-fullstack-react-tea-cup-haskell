import type { Animate, AnimateState } from '@/common/type/animate'

export type Model = {
  status: Animate<null>
}

export type Msg =
  | { _tag: 'Toggle'; open: boolean }
  | { _tag: 'SetState'; state: AnimateState }
