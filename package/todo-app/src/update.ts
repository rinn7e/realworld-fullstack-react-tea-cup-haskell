import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { Model, Msg, Todo } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const initialModel: Model = {
    todos: [
      { id: '1', text: 'Install Capacitor framework', completed: true },
      { id: '2', text: 'Build production bundles', completed: false },
      { id: '3', text: 'Run app inside native Android simulator', completed: false },
      { id: '4', text: 'Delight Master with pure FP performance', completed: false },
    ],
    inputText: '',
    filter: 'All',
    errorMsg: O.none,
  }
  return [initialModel, Cmd.none()]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ChangeInputText':
      return [
        {
          ...model,
          inputText: msg.text,
          errorMsg: model.inputText.trim() !== '' ? O.none : model.errorMsg,
        },
        Cmd.none(),
      ]

    case 'AddTodo': {
      const trimmed = model.inputText.trim()
      if (trimmed === '') {
        return [
          {
            ...model,
            errorMsg: O.some('Task description cannot be empty!'),
          },
          Cmd.none(),
        ]
      }
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: trimmed,
        completed: false,
      }
      return [
        {
          ...model,
          todos: [newTodo, ...model.todos],
          inputText: '',
          errorMsg: O.none,
        },
        Cmd.none(),
      ]
    }

    case 'ToggleTodo':
      return [
        {
          ...model,
          todos: model.todos.map((todo) =>
            todo.id === msg.id ? { ...todo, completed: !todo.completed } : todo,
          ),
        },
        Cmd.none(),
      ]

    case 'DeleteTodo':
      return [
        {
          ...model,
          todos: model.todos.filter((todo) => todo.id !== msg.id),
        },
        Cmd.none(),
      ]

    case 'ChangeFilter':
      return [
        {
          ...model,
          filter: msg.filter,
        },
        Cmd.none(),
      ]

    case 'ClearCompleted':
      return [
        {
          ...model,
          todos: model.todos.filter((todo) => !todo.completed),
        },
        Cmd.none(),
      ]

    case 'DismissError':
      return [
        {
          ...model,
          errorMsg: O.none,
        },
        Cmd.none(),
      ]
  }
}
