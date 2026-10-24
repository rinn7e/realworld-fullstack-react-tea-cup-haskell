import * as O from 'fp-ts/lib/Option'

import {
  type AppPage,
  type AppRoute,
  pageArticles,
  pageComments,
  pageHome,
  pageLogin,
  pageNotFound,
  pageSettings,
  pageUsers,
  pageVisitors,
} from '@/common/type/route'
import { type Shared } from '@/common/type/shared'
import * as Persona from '@/component/persona-panel'
import { defaultTheme } from '@/theme/data'
import { type Model } from '@/type'
import { initPageModel } from '@/update'

// Keyed by every page tag, so adding a page fails to compile until the tests
// that walk all routes cover it
const routeByTag: Record<AppPage['_tag'], AppRoute> = {
  PageHome: { page: pageHome() },
  PageLogin: { page: pageLogin() },
  PageArticle: { page: pageArticles() },
  PageUser: { page: pageUsers() },
  PageComment: { page: pageComments() },
  PageVisitor: { page: pageVisitors() },
  PageSetting: { page: pageSettings() },
  PageNotFound: { page: pageNotFound() },
}

export const allRoutes: AppRoute[] = Object.values(routeByTag)

export const loggedOut: Shared = { user: O.none, token: O.none }

// The server was unreachable at boot: the token is kept, the user is unknown
export const tokenOnly: Shared = { user: O.none, token: O.some('token') }

export const loggedIn: Shared = {
  user: O.some({
    username: 'admin',
    email: 'admin@example.com',
    token: 'token',
    bio: null,
    image: null,
  }),
  token: O.some('token'),
}

// A root model with `route` open, built the way the app builds it
export const modelAt = (route: AppRoute, shared: Shared = loggedIn): Model => {
  const [pageModel] = initPageModel(route, shared)
  const [persona] = Persona.init()
  return {
    pageModel,
    shared,
    persona,
    showScrollTop: false,
    theme: defaultTheme,
    colorScheme: 'auto',
  }
}
