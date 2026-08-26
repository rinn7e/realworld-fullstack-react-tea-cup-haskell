import { devTools } from '@rinn7e/tea-cup-prelude'
import * as TeaRouter from '@rinn7e/tea-cup-router'
import { ProgramWithNav } from 'react-tea-cup'
import { type Dispatcher, Sub } from 'tea-cup-fp'

import { App } from './app'
import { type Model, type Msg, TeaRouterMsg } from './type'
import { preInit, preUpdate } from './update'

const preLoadingView = () => {
  return (
    <div className='initial-loader-wrap'>
      <div className='initial-loader'></div>
    </div>
  )
}

const preView = (dispatch: Dispatcher<Msg>, model: Model | null) => {
  return model ? <App model={model} dispatch={dispatch} /> : preLoadingView()
}

export const AppProgram = () => {
  return (
    <ProgramWithNav<Model | null, Msg>
      onUrlChange={(location) => TeaRouterMsg(TeaRouter.UrlChangeMsg(location))}
      init={preInit}
      update={preUpdate}
      view={preView}
      subscriptions={() => Sub.none()}
      {...devTools<Model | null, Msg>().getProgramProps()}
    />
  )
}
