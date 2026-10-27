import { devTools } from '@rinn7e/tea-cup-prelude'
import { ProgramWithNav } from 'react-tea-cup'
import { Cmd, type Dispatcher, Sub } from 'tea-cup-fp'

import { App } from './app'
import { IS_RUNNING_E2E } from './common/env'
import { assignConduitDebug } from './e2e'
import { type Model, type Msg } from './type'
import { init, preInit, update } from './update'
import { urlChangedMsg, withUrl } from './util'

// Pre-views
// ---------------------------------------------

const PreLoadingView = () => (
  <div className='initial-loader-wrap'>
    <div className='initial-loader'></div>
  </div>
)

const preView = (dispatch: Dispatcher<Msg>, model: Model | null) => {
  if (IS_RUNNING_E2E) {
    assignConduitDebug(model)
  }
  return model ? <App model={model} dispatch={dispatch} /> : <PreLoadingView />
}

// The model is `null` until `Init` builds it. Every step after that goes
// through `withUrl`, the one wrapper around `update`: the URL follows the
// destination the step leaves.
const preUpdate = (msg: Msg, model: Model | null): [Model | null, Cmd<Msg>] => {
  if (model === null) {
    if (msg._tag === 'Init') {
      return init(msg.location, msg.user, msg.isUnavailable, msg.token)
    } else {
      return [null, Cmd.none()]
    }
  } else {
    return withUrl(msg, model, update(msg, model))
  }
}

// App
// ---------------------------------------------

export const AppProgram = () => {
  return (
    <ProgramWithNav<Model | null, Msg>
      // The browser's back and forward (the app's own URL writes fire no
      // `popstate`)
      onUrlChange={urlChangedMsg}
      init={preInit}
      update={preUpdate}
      view={preView}
      subscriptions={() => Sub.none()}
      {...devTools<Model | null, Msg>().getProgramProps()}
    />
  )
}
