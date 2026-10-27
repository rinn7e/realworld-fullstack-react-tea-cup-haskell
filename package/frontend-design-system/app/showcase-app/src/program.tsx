import { devTools } from '@rinn7e/tea-cup-prelude'
import { ProgramWithNav } from 'react-tea-cup'
import { type Dispatcher, Sub } from 'tea-cup-fp'

import { App } from './app'
import { type Model, type Msg } from './type'
import { init, update } from './update'
import { urlChangedMsg, withUrl } from './util'

const view = (dispatch: Dispatcher<Msg>, model: Model) => (
  <App model={model} dispatch={dispatch} />
)

export const AppProgram = () => (
  <ProgramWithNav<Model, Msg>
    // The browser's back and forward (the app's own URL writes fire no
    // `popstate`)
    onUrlChange={urlChangedMsg}
    init={init}
    // The one wrapper around `update`: the URL follows the destination the
    // step leaves
    update={(msg, model) => withUrl(msg, model, update(msg, model))}
    view={view}
    subscriptions={() => Sub.none<Msg>()}
    {...devTools<Model, Msg>().getProgramProps()}
  />
)
