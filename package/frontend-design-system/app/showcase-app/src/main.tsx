import { devTools } from '@rinn7e/tea-cup-prelude'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ProgramWithNav } from 'react-tea-cup'
import { Sub } from 'tea-cup-fp'

import './index.css'
import { type Model, type Msg, teaRouterMsg } from './type'
import { init, update } from './update'
import { view } from './view'

const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ProgramWithNav<Model, Msg>
        onUrlChange={(location) =>
          teaRouterMsg({ _tag: 'UrlChange', location })
        }
        init={init}
        update={update}
        view={view}
        subscriptions={() => Sub.none<Msg>()}
        {...devTools<Model, Msg>().getProgramProps()}
      />
    </React.StrictMode>,
  )
}
