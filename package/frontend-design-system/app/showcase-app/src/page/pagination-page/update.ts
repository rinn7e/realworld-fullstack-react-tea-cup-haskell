import { Pagination as DsPagination } from '@rinn7e/realworld-design-system'
import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [paginationModel] = DsPagination.init(1, 5)
  return [{ showCode: true, paginationModel }, Cmd.none()]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ToggleShowCode':
      return [{ ...model, showCode: !model.showCode }, Cmd.none()]
    case 'PaginationMsg': {
      const [paginationModel, cmd] = DsPagination.update(msg.subMsg)(
        model.paginationModel,
      )
      return [
        { ...model, paginationModel },
        cmd.map((subMsg: DsPagination.Msg) => ({
          _tag: 'PaginationMsg',
          subMsg,
        })),
      ]
    }
  }
}
