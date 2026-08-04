import { Modal as DsModal } from '@rinn7e/realworld-design-system'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [modalRichModel, richCmd] = DsModal.init(false)
  const [modalDangerModel, dangerCmd] = DsModal.init(false)

  const mappedRichCmd: Cmd<Msg> = richCmd.map((subMsg) => ({
    _tag: 'ModalRichMsg' as const,
    subMsg,
  }))
  const mappedDangerCmd: Cmd<Msg> = dangerCmd.map((subMsg) => ({
    _tag: 'ModalDangerMsg' as const,
    subMsg,
  }))

  return [
    {
      showCode: true,
      modalRichModel,
      modalDangerModel,
    },
    Cmd.batch([mappedRichCmd, mappedDangerCmd]),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]

    case 'ModalRichMsg': {
      const [nextRichModel, cmd] = DsModal.update(msg.subMsg)(
        model.modalRichModel,
      )
      const mappedCmd: Cmd<Msg> = cmd.map((subMsg) => ({
        _tag: 'ModalRichMsg' as const,
        subMsg,
      }))
      return [{ ...model, modalRichModel: nextRichModel }, mappedCmd]
    }

    case 'ModalDangerMsg': {
      const [nextDangerModel, cmd] = DsModal.update(msg.subMsg)(
        model.modalDangerModel,
      )
      const mappedCmd: Cmd<Msg> = cmd.map((subMsg) => ({
        _tag: 'ModalDangerMsg' as const,
        subMsg,
      }))
      return [{ ...model, modalDangerModel: nextDangerModel }, mappedCmd]
    }
  }
}
