import { Modal } from '@rinn7e/realworld-design-system'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [modalModel] = Modal.init()
  return [{ showCode: true, modalModel }, Cmd.none()]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]
    case 'ModalMsg': {
      const [modalModel, cmd] = Modal.update(msg.subMsg)(model.modalModel)
      return [
        { ...model, modalModel },
        cmd.map((subMsg: Modal.Msg) => ({ _tag: 'ModalMsg', subMsg })),
      ]
    }
  }
}
