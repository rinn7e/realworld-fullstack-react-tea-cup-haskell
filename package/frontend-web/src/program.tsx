import { devTools } from '@rinn7e/tea-cup-prelude'
import { ProgramWithNav } from 'react-tea-cup'
import { type Dispatcher, Sub } from 'tea-cup-fp'

import { App } from './app'
import { IS_RUNNING_E2E } from './common/env'
import { assignConduitDebug } from './e2e'
import { type Model, type Msg, teaRouterMsg } from './type'
import { preInit, preUpdate } from './update'

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

// App
// ---------------------------------------------

export const AppProgram = () => {
  return (
    <ProgramWithNav<Model | null, Msg>
      onUrlChange={(location) => teaRouterMsg({ _tag: 'UrlChange', location })}
      init={preInit}
      update={preUpdate}
      view={preView}
      subscriptions={() => Sub.none()}
      {...devTools<Model | null, Msg>().getProgramProps()}
    />
  )
}
