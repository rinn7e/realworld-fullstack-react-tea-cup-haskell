import { Popover as DsPopover } from '@rinn7e/realworld-design-system'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [popoverLeftModel, leftCmd] = DsPopover.init(false)
  const [popoverRightModel, rightCmd] = DsPopover.init(false)

  const mappedLeftCmd: Cmd<Msg> = leftCmd.map((subMsg) => ({
    _tag: 'PopoverLeftMsg' as const,
    subMsg,
  }))
  const mappedRightCmd: Cmd<Msg> = rightCmd.map((subMsg) => ({
    _tag: 'PopoverRightMsg' as const,
    subMsg,
  }))

  return [
    {
      showCode: true,
      popoverLeftModel,
      popoverRightModel,
    },
    Cmd.batch([mappedLeftCmd, mappedRightCmd]),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]

    case 'PopoverLeftMsg': {
      const [nextLeftModel, cmd] = DsPopover.update(msg.subMsg)(
        model.popoverLeftModel,
      )
      const mappedCmd: Cmd<Msg> = cmd.map((subMsg) => ({
        _tag: 'PopoverLeftMsg' as const,
        subMsg,
      }))
      return [{ ...model, popoverLeftModel: nextLeftModel }, mappedCmd]
    }

    case 'PopoverRightMsg': {
      const [nextRightModel, cmd] = DsPopover.update(msg.subMsg)(
        model.popoverRightModel,
      )
      const mappedCmd: Cmd<Msg> = cmd.map((subMsg) => ({
        _tag: 'PopoverRightMsg' as const,
        subMsg,
      }))
      return [{ ...model, popoverRightModel: nextRightModel }, mappedCmd]
    }
  }
}
