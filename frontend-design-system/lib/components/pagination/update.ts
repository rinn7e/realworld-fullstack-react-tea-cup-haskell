import { Cmd } from 'tea-cup-fp'
import type { Model, Msg } from './type'

export const init = (
  currentPage = 1,
  totalPages = 10,
): [Model, Cmd<Msg>] => [{ currentPage, totalPages }, Cmd.none()]

export const update =
  (msg: Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'SetPage':
        return [{ ...model, currentPage: msg.page }, Cmd.none()]
    }
  }
