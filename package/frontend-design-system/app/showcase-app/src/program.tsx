import { devTools } from '@rinn7e/tea-cup-prelude'
import { ProgramWithNav } from 'react-tea-cup'
import { type Dispatcher, Sub } from 'tea-cup-fp'

import { App } from './app'
import { type Model, type Msg, teaRouterMsg } from './type'
import { init, update } from './update'

const view = (dispatch: Dispatcher<Msg>, model: Model) => (
  <App model={model} dispatch={dispatch} />
)

export const AppProgram = () => (
  <ProgramWithNav<Model, Msg>
    onUrlChange={(location) => teaRouterMsg({ _tag: 'UrlChange', location })}
    init={init}
    update={update}
    view={view}
    subscriptions={() => Sub.none<Msg>()}
    {...devTools<Model, Msg>().getProgramProps()}
  />
)
