import type { Menu, Navbar } from '@rinn7e/realworld-design-system'

import type * as ButtonPage from './page/button/type'
import type * as ComponentPage from './page/component/type'
import type * as HomePage from './page/home/type'
import type * as NotFoundPage from './page/not-found/type'
import type { AppRoute } from './route/type'

export type PageModel =
  | { _tag: 'HomePageModel'; model: HomePage.Model }
  | { _tag: 'ButtonPageModel'; model: ButtonPage.Model }
  | { _tag: 'ComponentPageModel'; model: ComponentPage.Model }
  | { _tag: 'NotFoundPageModel'; model: NotFoundPage.Model }

export type SectionCategory =
  | 'elements'
  | 'components'
  | 'form'
  | 'layout'
  | 'grid'

export type Model = {
  route: AppRoute
  isInternal: boolean
  pageModel: PageModel
  searchQuery: string
  navbarModel: Navbar.Model
  menuModel: Menu.Model
}

export type Msg =
  | { _tag: 'NoOp' }
  | { _tag: 'Init'; location: Location }
  | { _tag: 'UrlChange'; location: Location }
  | { _tag: 'ChangeRoute'; route: AppRoute }
  | { _tag: 'UpdateSearch'; query: string }
  | { _tag: 'HomePageMsg'; subMsg: HomePage.Msg }
  | { _tag: 'ButtonPageMsg'; subMsg: ButtonPage.Msg }
  | { _tag: 'ComponentPageMsg'; subMsg: ComponentPage.Msg }
  | { _tag: 'NotFoundPageMsg'; subMsg: NotFoundPage.Msg }
  | { _tag: 'NavbarMsg'; subMsg: Navbar.Msg }
  | { _tag: 'MenuMsg'; subMsg: Menu.Msg }
