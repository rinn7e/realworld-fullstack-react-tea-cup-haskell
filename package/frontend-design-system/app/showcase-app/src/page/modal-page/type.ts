import { Modal as DsModal } from '@rinn7e/realworld-design-system'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import type { Dispatcher } from 'tea-cup-fp'

export type Model = {
  showCode: boolean
  modalRichModel: DsModal.Model
  modalDangerModel: DsModal.Model
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  showCode: B.Eq,
  modalRichModel: DsModal.ModelEq,
  modalDangerModel: DsModal.ModelEq,
})

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'ModalRichMsg'; subMsg: DsModal.Msg }
  | { _tag: 'ModalDangerMsg'; subMsg: DsModal.Msg }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqClass.eqStrict,
})
