import { devTools } from '@rinn7e/tea-cup-prelude'
import { ProgramWithNav } from 'react-tea-cup'
import { type Dispatcher, Sub } from 'tea-cup-fp'

import { App } from './app'
import { type Model, type Msg } from './type'
import { preInit, preUpdate } from './update'
import { withUrlSync } from './url-port'

const PreLoadingView = () => (
  <div className='initial-loader-wrap'>
    <div className='initial-loader'></div>
  </div>
)

const preView = (dispatch: Dispatcher<Msg>, model: Model | null) => {
  return model ? <App model={model} dispatch={dispatch} /> : <PreLoadingView />
}

export const AppProgram = () => {
  return (
    <ProgramWithNav<Model | null, Msg>
      onUrlChange={(location): Msg => ({ _tag: 'UrlChange', location })}
      init={preInit}
      update={withUrlSync(preUpdate)}
      view={preView}
      subscriptions={() => Sub.none()}
      {...devTools<Model | null, Msg>().getProgramProps()}
    />
  )
}
