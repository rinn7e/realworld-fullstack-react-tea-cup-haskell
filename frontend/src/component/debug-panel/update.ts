import type { Model, Msg } from './type'

export const init = (): Model => ({
  isCollapse: true,
})

export const update = (msg: Msg, model: Model): Model => {
  switch (msg._tag) {
    case 'ToggleCollapse':
      return { ...model, isCollapse: !model.isCollapse }
  }
}
