import { Modal as DsModal } from '@rinn7e/realworld-design-system'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [modalModel] = DsModal.init()
  return [{ showCode: true, modalModel }, Cmd.none()]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]
    case 'ModalMsg': {
      const [modalModel, cmd] = DsModal.update(msg.subMsg)(model.modalModel)
      return [
        { ...model, modalModel },
        cmd.map((subMsg: DsModal.Msg) => ({ _tag: 'ModalMsg', subMsg })),
      ]
    }
  }
}
