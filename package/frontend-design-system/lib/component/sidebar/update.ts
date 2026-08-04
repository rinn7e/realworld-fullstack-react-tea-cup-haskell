import { Cmd } from 'tea-cup-fp'

import type { Model, Msg } from './type'

export const init = (initialCollapsed = false): [Model, Cmd<Msg>] => [
  { collapsed: initialCollapsed, expandedKeys: [] },
  Cmd.none(),
]

export const update =
  (msg: Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'ToggleCollapsed':
        return [{ ...model, collapsed: !model.collapsed }, Cmd.none()]
      case 'SetCollapsed':
        return [{ ...model, collapsed: msg.collapsed }, Cmd.none()]
      case 'ToggleExpand': {
        const expandedKeys = model.expandedKeys || []
        const isExpanded = expandedKeys.includes(msg.key)
        const nextKeys = isExpanded
          ? expandedKeys.filter((k) => k !== msg.key)
          : [...expandedKeys, msg.key]
        return [{ ...model, expandedKeys: nextKeys }, Cmd.none()]
      }
      case 'ClickItem': {
        if (msg.item.children && msg.item.children.length > 0) {
          const expandedKeys = model.expandedKeys || []
          const isExpanded = expandedKeys.includes(msg.item.key)
          const nextKeys = isExpanded
            ? expandedKeys.filter((k) => k !== msg.item.key)
            : [...expandedKeys, msg.item.key]
          return [{ ...model, expandedKeys: nextKeys }, Cmd.none()]
        }
        return [model, Cmd.none()]
      }
    }
  }
