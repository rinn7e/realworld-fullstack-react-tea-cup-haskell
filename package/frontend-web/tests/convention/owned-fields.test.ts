import { describe, expect, it } from 'vitest'

import {
  type Destination,
  type DestinationAfterGuard,
  type HomeTab,
  homeScreen,
} from '@/common/type/destination'
import { type Shared } from '@/common/type/shared'
import { initScreenModel } from '@/handler/navigation-handler'
import type * as ArticleScreen from '@/screen/article-screen'
import type * as HomeScreen from '@/screen/home-screen'
import type * as ProfileScreen from '@/screen/profile-screen'
import { type Model, type ScreenModel, withScreenModel } from '@/type'

import { guarded } from '../helper/guarded'

// Make impossible updates impossible: a fact with an owner has a type only
// its owner makes. Each `@ts-expect-error` below is a bypass of the owner;
// `tsc` fails if one of them type checks again. Never called: the test is
// the type check.
const bypasses = (
  model: Model,
  screenModel: ScreenModel,
  home: HomeScreen.Model,
  profile: ProfileScreen.Model,
  article: ArticleScreen.Model,
  tab: HomeTab,
  destination: Destination,
  afterGuard: DestinationAfterGuard,
  shared: Shared,
) => [
  // Reading stays free: an owned value is still its plain type
  model.screenModel satisfies ScreenModel,
  home.tab satisfies HomeTab,
  profile.username satisfies string,
  profile.showFavorites satisfies boolean,
  article.slug satisfies string,
  afterGuard satisfies Destination,

  // The screen changes only by a move
  // @ts-expect-error a `ScreenModel` is not a `CurrentScreenModel`
  { ...model, screenModel } satisfies Model,
  // @ts-expect-error a `ScreenModel` is not a `CurrentScreenModel`
  withScreenModel(model, { _tag: 'NotFoundScreenModel' }),

  // The params a screen holds change only by its own `init` or the reader
  // changing them on the screen
  // @ts-expect-error a `HomeTab` is not a `CurrentHomeTab`
  { ...home, tab } satisfies HomeScreen.Model,
  // @ts-expect-error a `boolean` is not a `CurrentShowFavorites`
  { ...profile, showFavorites: true } satisfies ProfileScreen.Model,
  // @ts-expect-error a `string` is not a `CurrentUsername`
  { ...profile, username: 'someone' } satisfies ProfileScreen.Model,
  // @ts-expect-error a `string` is not a `CurrentSlug`
  { ...article, slug: 'another-post' } satisfies ArticleScreen.Model,

  // A move opens only what the guard let through
  // @ts-expect-error a `Destination` is not a `DestinationAfterGuard`
  initScreenModel(destination, shared),

  // Copying or changing an owned value by a spread drops its brand: the
  // result is the plain type again, not owned
  initScreenModel(
    // @ts-expect-error a changed `DestinationAfterGuard` is a `Destination`
    { ...afterGuard, screen: homeScreen(tab, 1) },
    shared,
  ),
  {
    ...model,
    // @ts-expect-error a spread copy of a `CurrentScreenModel` is a `ScreenModel`
    screenModel: { ...model.screenModel },
  } satisfies Model,
  // @ts-expect-error a spread copy of a `CurrentHomeTab` is a `HomeTab`
  { ...home, tab: { ...home.tab } } satisfies HomeScreen.Model,

  // Through the owners it type checks
  initScreenModel(guarded(destination), shared),
  // Copying the parent keeps its owned values (they are not changed)
  { ...model } satisfies Model,
  { ...home } satisfies HomeScreen.Model,
]

describe('owned fields', () => {
  it('are written only by their owner (checked by tsc)', () => {
    expect(bypasses).toBeTypeOf('function')
  })
})
