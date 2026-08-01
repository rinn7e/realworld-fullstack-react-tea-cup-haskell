import { Modal } from '@rinn7e/realworld-design-system'

export type Model = {
  showCode: boolean
  modalModel: Modal.Model
}

export type Msg =
  | { _tag: 'ToggleShowCode' }
  | { _tag: 'ModalMsg'; subMsg: Modal.Msg }
