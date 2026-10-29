import { Text } from 'ink'
import { Program } from 'react-tea-cup'
import { Cmd, type Dispatcher, Sub } from 'tea-cup-fp'

import { AppMemo } from './app'
import { type Model, type Msg } from './type'
import { init, preInit, update } from './update'

const preView = (dispatch: Dispatcher<Msg>, model: Model | null) =>
  model ? (
    <AppMemo model={model} dispatch={dispatch} />
  ) : (
    <Text dimColor>Connecting...</Text>
  )

// The model is `null` until `Init` builds it
const preUpdate = (msg: Msg, model: Model | null): [Model | null, Cmd<Msg>] => {
  if (model === null) {
    if (msg._tag === 'Init') {
      return init(msg.boot)
    } else {
      return [null, Cmd.none()]
    }
  } else {
    return update(msg, model)
  }
}

export const AppProgram = () => (
  <Program<Model | null, Msg>
    init={preInit}
    update={preUpdate}
    view={preView}
    subscriptions={() => Sub.none()}
  />
)
