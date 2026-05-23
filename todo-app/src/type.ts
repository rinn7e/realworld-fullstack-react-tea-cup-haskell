import * as O from 'fp-ts/lib/Option'

export interface Todo {
  id: string
  text: string
  completed: boolean
}

export type Filter = 'All' | 'Active' | 'Completed'

export interface Model {
  todos: Todo[]
  inputText: string
  filter: Filter
  errorMsg: O.Option<string>
}

export type Msg =
  | { _tag: 'ChangeInputText'; text: string }
  | { _tag: 'AddTodo' }
  | { _tag: 'ToggleTodo'; id: string }
  | { _tag: 'DeleteTodo'; id: string }
  | { _tag: 'ChangeFilter'; filter: Filter }
  | { _tag: 'ClearCompleted' }
  | { _tag: 'DismissError' }
