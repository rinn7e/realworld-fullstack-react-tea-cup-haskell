import { Modal as DsModal } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  modalRichModel: DsModal.Model
  modalDangerModel: DsModal.Model
}

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'ModalRichMsg'; subMsg: DsModal.Msg }
  | { _tag: 'ModalDangerMsg'; subMsg: DsModal.Msg }
