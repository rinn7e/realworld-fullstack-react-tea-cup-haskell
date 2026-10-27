import * as O from 'fp-ts/lib/Option'

import {
  type Destination,
  type DestinationAfterGuard,
} from '@/common/type/destination'
import { guardDestination } from '@/util'

import { user } from './app'

// `destination` as a move opens it: through the real guard, signed in (the
// guard lets every screen but login and signup through unchanged)
export const guarded = (destination: Destination): DestinationAfterGuard =>
  guardDestination(
    { user: O.some(user), token: O.some(user.token) },
    destination,
  )
