import { Modal as DsModal } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  modalModel: DsModal.Model
}

export type Msg =
  { _tag: 'ToggleShowCode' } | { _tag: 'ModalMsg'; subMsg: DsModal.Msg }
