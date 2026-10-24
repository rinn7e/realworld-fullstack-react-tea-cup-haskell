import * as DsFloatingSidebar from '@rinn7e/realworld-design-system/component/floating-sidebar'
import * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import * as O from 'fp-ts/lib/Option'

import { type AppRoute } from '@/common/type/route'
import { type Shared } from '@/common/type/shared'
import * as DebugPanel from '@/component/debug-panel'
import { type Model } from '@/type'
import { initPageModel } from '@/update'

export const loggedOut: Shared = { user: O.none, token: O.none }

export const loggedIn: Shared = {
  user: O.some({
    email: 'jake@example.com',
    username: 'jake',
    bio: null,
    image: null,
  }),
  token: O.some('token'),
}

// A root model with `route` open, built the way the app builds it
export const modelAt = (route: AppRoute, shared: Shared = loggedIn): Model => {
  const [pageModel] = initPageModel(route, shared)
  return {
    pageModel,
    unavailableMode: false,
    shared,
    debugPanel: DebugPanel.init(),
    sidebar: DsFloatingSidebar.init()[0],
    navbar: DsNavbar.init()[0],
    colorScheme: 'auto',
  }
}
