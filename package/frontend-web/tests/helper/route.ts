import * as O from 'fp-ts/lib/Option'

import {
  type AppPage,
  type AppRoute,
  globalFeedTab,
  pageArticle,
  pageEditor,
  pageHome,
  pageLogin,
  pageNotFound,
  pageProfile,
  pageSettings,
  pageSignup,
  tagFeedTab,
  userFeedTab,
} from '@/common/type/route'

// Sample routes keyed by every page tag, so adding a page fails to compile
// until the tests that walk all routes cover it. Pages with params get one
// sample per shape of their URL.
const routesByTag: Record<AppPage['_tag'], AppRoute[]> = {
  PageHome: [
    { page: pageHome(globalFeedTab(), 1) },
    { page: pageHome(globalFeedTab(), 3) },
    { page: pageHome(userFeedTab(), 1) },
    { page: pageHome(tagFeedTab('react'), 2) },
  ],
  PageLogin: [{ page: pageLogin() }],
  PageSignup: [{ page: pageSignup() }],
  PageSettings: [{ page: pageSettings() }],
  PageEditor: [
    { page: pageEditor(O.none) },
    { page: pageEditor(O.some('my-post')) },
  ],
  PageArticle: [{ page: pageArticle('my-post') }],
  PageProfile: [
    { page: pageProfile('jake', false) },
    { page: pageProfile('jake', true) },
  ],
  PageNotFound: [{ page: pageNotFound() }],
}

export const allRoutes: AppRoute[] = Object.values(routesByTag).flat()
