import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd, Task } from 'tea-cup-fp'

import { type Boot } from '@core/type'
import * as Core from '@core/update'
import { destinationOf } from '@core/util'

import { replaceUrlCmd } from '@/common/util'
import * as Persona from '@/component/persona-panel'
import { bootDestinationOf, bootUrlOf } from '@/util'

import { defaultTheme, themes } from './theme/data'
import { type ColorScheme, type Theme } from './theme/type'
import {
  injectTheme,
  loadColorScheme,
  loadThemeId,
  saveColorScheme,
  saveTheme,
} from './theme/util'
import { type Model, type Msg } from './type'

// Initialization
// ---------------------------------------------

export const preInit = (location: Location): [Model | null, Cmd<Msg>] => {
  return [null, initializeCmd(location)]
}

export const init = (location: Location, boot: Boot): [Model, Cmd<Msg>] => {
  const urlDestination = bootDestinationOf(location)
  const [coreModel, coreCmd] = Core.init(boot, urlDestination)

  const [personaModel, personaCmd] = Persona.init()
  const colorScheme = loadColorScheme()
  const savedThemeId = loadThemeId()
  const theme = (savedThemeId ? themes[savedThemeId] : null) ?? defaultTheme

  const model: Model = {
    ...coreModel,
    persona: personaModel,
    showScrollTop: false,
    theme,
    colorScheme,
  }

  const initCmd = Cmd.batch([
    pipe(
      bootUrlOf(urlDestination, destinationOf(model)),
      O.fold(
        () => Cmd.none<Msg>(),
        (url) => replaceUrlCmd(url).map((noOp): Msg => noOp),
      ),
    ),
    coreCmd,
    personaCmd.map((subMsg): Msg => ({ _tag: 'PersonaMsg', subMsg })),
  ])

  return [model, initCmd]
}

export const initializeCmd = (location: Location): Cmd<Msg> => {
  const colorScheme = loadColorScheme()
  const savedThemeId = loadThemeId()
  const theme = (savedThemeId ? themes[savedThemeId] : null) ?? defaultTheme

  // Inject theme right on initialization to avoid flash of unstyled content
  injectTheme(theme, colorScheme)

  return Core.initializeCmd((boot): Msg => ({ _tag: 'Init', location, boot }))
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'Init':
      // Handled before the model exists (`program.tsx`)
      return [model, Cmd.none()]
    case 'PersonaMsg':
      return personaMsgHandler(msg.subMsg, model)
    case 'SetShowScrollTop':
      return [{ ...model, showScrollTop: msg.value }, Cmd.none()]
    case 'ScrollToTop':
      return scrollToTopHandler(model)
    case 'SwitchTheme':
      return switchThemeHandler(msg.theme, model)
    case 'SetColorScheme':
      return setColorSchemeHandler(msg.scheme, model)
    default:
      // The messages of the core (navigation, session, screens)
      return Core.update(msg, model)
  }
}

// Handlers
// ---------------------------------------------

const personaMsgHandler = (
  subMsg: Persona.Msg,
  model: Model,
): [Model, Cmd<Msg>] => {
  const [m, c] = Persona.update(subMsg, model.persona)
  return [
    { ...model, persona: m },
    c.map((msg): Msg => ({ _tag: 'PersonaMsg', subMsg: msg })),
  ]
}

const scrollToTopHandler = (model: Model): [Model, Cmd<Msg>] => {
  return [
    model,
    Task.perform(
      Task.succeed(undefined).andThen(() => {
        document
          .getElementById('main-content')
          ?.scrollTo({ top: 0, behavior: 'smooth' })
        return Task.succeed(undefined)
      }),
      (): Msg => ({ _tag: 'NoOp' }),
    ),
  ]
}

const switchThemeHandler = (theme: Theme, model: Model): [Model, Cmd<Msg>] => {
  return [
    { ...model, theme },
    Task.perform(
      Task.succeed(undefined).andThen(() => {
        saveTheme(theme)
        injectTheme(theme, model.colorScheme)
        return Task.succeed(undefined)
      }),
      (): Msg => ({ _tag: 'NoOp' }),
    ),
  ]
}

const setColorSchemeHandler = (
  scheme: ColorScheme,
  model: Model,
): [Model, Cmd<Msg>] => {
  return [
    { ...model, colorScheme: scheme },
    Task.perform(
      Task.succeed(undefined).andThen(() => {
        saveColorScheme(scheme)
        injectTheme(model.theme, scheme)
        return Task.succeed(undefined)
      }),
      (): Msg => ({ _tag: 'NoOp' }),
    ),
  ]
}
