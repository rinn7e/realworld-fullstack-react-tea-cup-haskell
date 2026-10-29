import { describe, expect, it } from 'vitest'

import {
  type Destination,
  type DestinationAfterGuard,
  homeScreen,
} from '@core/common/type/destination'
import { type Shared } from '@core/common/type/shared'
import { initScreenModel } from '@core/handler/navigation-handler'
import { type Model, type ScreenModel, withScreenModel } from '@core/type'

import { guarded } from '../helper/guarded'

// Make impossible updates impossible: a fact with an owner has a type only
// its owner makes. Each `@ts-expect-error` below is a bypass of the owner;
// `tsc` fails if one of them type checks again. Never called: the test is
// the type check.
const bypasses = (
  model: Model,
  screenModel: ScreenModel,
  destination: Destination,
  afterGuard: DestinationAfterGuard,
  shared: Shared,
) => [
  // Reading stays free: an owned value is still its plain type
  model.screenModel satisfies ScreenModel,
  afterGuard satisfies Destination,

  // The screen changes only by a move
  // @ts-expect-error a `ScreenModel` is not a `CurrentScreenModel`
  { ...model, screenModel } satisfies Model,
  // @ts-expect-error a `ScreenModel` is not a `CurrentScreenModel`
  withScreenModel(model, { _tag: 'SettingScreenModel' }),

  // A move opens only what the guard let through
  // @ts-expect-error a `Destination` is not a `DestinationAfterGuard`
  initScreenModel(destination, shared),

  // Changing an owned value by a spread drops its brand: the result is the
  // plain type again, not owned
  initScreenModel(
    // @ts-expect-error a changed `DestinationAfterGuard` is a `Destination`
    { ...afterGuard, screen: homeScreen() },
    shared,
  ),
  {
    ...model,
    // @ts-expect-error a changed `CurrentScreenModel` is a `ScreenModel`
    screenModel: { ...model.screenModel, _tag: 'SettingScreenModel' },
  } satisfies Model,

  // Through the owners it type checks
  initScreenModel(guarded(destination), shared),
  // Copying the parent keeps its owned values (they are not changed)
  { ...model } satisfies Model,
]

describe('owned fields', () => {
  it('are written only by their owner (checked by tsc)', () => {
    expect(bypasses).toBeTypeOf('function')
  })
})
