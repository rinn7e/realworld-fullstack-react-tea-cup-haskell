import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { IS_DISABLE_URL } from '@/common/env'
import {
  type Destination,
  DestinationEq,
  defaultDestination,
  parseDestination,
  toUrlString,
} from '@/common/type/destination'
import { pushUrlCmd, replaceUrlCmd } from '@/common/util'
import { type Model, type Msg } from '@/type'

import { destinationOf } from './destination'

// The URL is an adapter at the edges: written from the destination
// (`destinationOf`, read from the models) after every step, read only at
// boot and on the browser's back and forward (`UrlChanged`).
// `toUrlString` / `parseDestination` are the only code that knows its
// spelling. With `VITE_DISABLE_URL` (`IS_DISABLE_URL`) the wrapper is off,
// and the app runs on in-app navigation alone: every function here that
// reads or writes the URL checks it.
export type UrlWrite =
  | { readonly _tag: 'PushUrl'; readonly url: string }
  | { readonly _tag: 'ReplaceUrl'; readonly url: string }

// How the browser's history follows a step: every change of destination
// pushes an entry, so the browser's back returns to the destination
// before. The same destination writes nothing (a click on the screen shown
// refreshes it, with no new entry). The browser's own move (`UrlChanged`)
// already has its entry: it is corrected with a replace only when the app
// shows another destination than the one its URL opens (the guard's
// redirect), not for another spelling of the same destination.
export const urlWriteOf = (
  msg: Msg,
  prevModel: Model,
  model: Model,
): O.Option<UrlWrite> => {
  const url = toUrlString(destinationOf(model))
  if (msg._tag === 'NavigationMsg' && msg.subMsg._tag === 'UrlChanged') {
    return DestinationEq.equals(destinationOf(model), msg.subMsg.destination)
      ? O.none
      : O.some({ _tag: 'ReplaceUrl', url })
  } else if (url === toUrlString(destinationOf(prevModel))) {
    return O.none
  } else {
    return O.some({ _tag: 'PushUrl', url })
  }
}

// The destination the app boots on: the page's URL, or with the URL off the
// default destination
export const bootDestinationOf = (location: Location): Destination =>
  IS_DISABLE_URL ? defaultDestination() : parseDestination(location.href)

// The browser's back or forward landed on `location`: opened as a move, or
// ignored with the URL off
export const urlChangedMsg = (location: Location): Msg =>
  IS_DISABLE_URL
    ? { _tag: 'NoOp' }
    : {
        _tag: 'NavigationMsg',
        subMsg: {
          _tag: 'UrlChanged',
          destination: parseDestination(location.href),
        },
      }

// The URL the boot's entry is corrected to: the guard's redirect of the
// page's URL (`urlDestination`). A replace, so a back to it does not only
// redirect again.
export const bootUrlOf = (
  urlDestination: Destination,
  destination: Destination,
): O.Option<string> =>
  !IS_DISABLE_URL && !DestinationEq.equals(urlDestination, destination)
    ? O.some(toUrlString(destination))
    : O.none

// Keeps the URL in sync with the destination (see `urlWriteOf`), unless the
// URL is off. The one wrapper around the root `update` (`program.tsx`): see
// "No update wrapper" in the code convention.
export const withUrl = (
  msg: Msg,
  prevModel: Model,
  [model, cmd]: [Model, Cmd<Msg>],
): [Model, Cmd<Msg>] =>
  pipe(
    IS_DISABLE_URL ? O.none : urlWriteOf(msg, prevModel, model),
    O.fold(
      (): [Model, Cmd<Msg>] => [model, cmd],
      (write): [Model, Cmd<Msg>] => [
        model,
        Cmd.batch([
          write._tag === 'PushUrl'
            ? pushUrlCmd(write.url)
            : replaceUrlCmd(write.url),
          cmd,
        ]),
      ],
    ),
  )
