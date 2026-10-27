import { Popover as DsPopover } from '@rinn7e/realworld-design-system'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import type { Dispatcher } from 'tea-cup-fp'

export type Model = {
  showCode: boolean
  popoverLeftModel: DsPopover.Model
  popoverRightModel: DsPopover.Model
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  showCode: B.Eq,
  popoverLeftModel: DsPopover.ModelEq,
  popoverRightModel: DsPopover.ModelEq,
})

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'PopoverLeftMsg'; subMsg: DsPopover.Msg }
  | { _tag: 'PopoverRightMsg'; subMsg: DsPopover.Msg }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqClass.eqStrict,
})
