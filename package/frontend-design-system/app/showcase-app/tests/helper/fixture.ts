import {
  ALL_COMPONENT_ITEMS,
  type AppRoute,
  pageHome,
  pageNotFound,
  parsePath,
} from '@/common/type/route'
import type { Model } from '@/type'
import { init, initPageModel } from '@/update'

export const allRoutes: AppRoute[] = [
  { page: pageHome() },
  ...ALL_COMPONENT_ITEMS.map((item) => parsePath(`/${item}`)),
  { page: pageNotFound() },
]

// A booted app with `route` open. Needs `stubBrowser` first, as `init` reads
// the saved color scheme.
export const modelAt = (route: AppRoute): Model => {
  const [model] = init(window.location)
  const [pageModel] = initPageModel(route)
  return { ...model, pageModel }
}
