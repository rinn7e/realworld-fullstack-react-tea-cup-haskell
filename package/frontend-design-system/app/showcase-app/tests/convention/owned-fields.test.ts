import { describe, expect, it } from 'vitest'

import { type Destination } from '@/common/type/destination'
import { initScreenModel } from '@/handler/navigation-handler'
import { type Model, type ScreenModel } from '@/type'

// Make impossible updates impossible: a fact with an owner has a type only
// its owner makes. Each `@ts-expect-error` below is a bypass of the owner;
// `tsc` fails if one of them type checks again. Never called: the test is
// the type check.
const bypasses = (
  model: Model,
  screenModel: ScreenModel,
  destination: Destination,
) => [
  // Reading stays free: an owned value is still its plain type
  model.screenModel satisfies ScreenModel,

  // The screen changes only by a move
  // @ts-expect-error a `ScreenModel` is not a `CurrentScreenModel`
  { ...model, screenModel } satisfies Model,

  // Changing an owned value by a spread drops its brand: the result is the
  // plain type again, not owned
  {
    ...model,
    // @ts-expect-error a spread copy of a `CurrentScreenModel` is a `ScreenModel`
    screenModel: { ...model.screenModel },
  } satisfies Model,

  // Through the owner it type checks
  { ...model, screenModel: initScreenModel(destination)[0] } satisfies Model,
  // Copying the parent keeps its owned values (they are not changed)
  { ...model } satisfies Model,
]

describe('owned fields', () => {
  it('are written only by their owner (checked by tsc)', () => {
    expect(bypasses).toBeTypeOf('function')
  })
})
