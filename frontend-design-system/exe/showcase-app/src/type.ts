import type { Menu, Navbar } from '@rinn7e/realworld-design-system'

import type * as BlockPage from './page/block/type'
import type * as BoxPage from './page/box/type'
import type * as BreadcrumbPage from './page/breadcrumb/type'
import type * as ButtonPage from './page/button/type'
import type * as CardPage from './page/card/type'
import type * as CheckboxPage from './page/checkbox/type'
import type * as ColumnsPage from './page/columns/type'
import type * as ContainerPage from './page/container/type'
import type * as ContentPage from './page/content/type'
import type * as DeletePage from './page/delete/type'
import type * as DropdownPage from './page/dropdown/type'
import type * as FieldPage from './page/field/type'
import type * as FilePage from './page/file/type'
import type * as FooterPage from './page/footer/type'
import type * as HeroPage from './page/hero/type'
import type * as HomePage from './page/home/type'
import type * as IconPage from './page/icon/type'
import type * as ImagePage from './page/image/type'
import type * as InputPage from './page/input/type'
import type * as LevelPage from './page/level/type'
import type * as MediaObjectPage from './page/media-object/type'
import type * as MenuPage from './page/menu/type'
import type * as MessagePage from './page/message/type'
import type * as ModalPage from './page/modal/type'
import type * as NavbarPage from './page/navbar/type'
import type * as NotFoundPage from './page/not-found/type'
import type * as NotificationPage from './page/notification/type'
import type * as PaginationPage from './page/pagination/type'
import type * as PanelPage from './page/panel/type'
import type * as ProgressPage from './page/progress/type'
import type * as RadioPage from './page/radio/type'
import type * as SectionPage from './page/section/type'
import type * as SelectPage from './page/select/type'
import type * as TablePage from './page/table/type'
import type * as TabsPage from './page/tabs/type'
import type * as TagPage from './page/tag/type'
import type * as TextareaPage from './page/textarea/type'
import type * as TitlePage from './page/title/type'
import type { AppRoute } from './route/type'

export type PageModel =
  | { _tag: 'HomePageModel'; model: HomePage.Model }
  | { _tag: 'BlockPageModel'; model: BlockPage.Model }
  | { _tag: 'BoxPageModel'; model: BoxPage.Model }
  | { _tag: 'BreadcrumbPageModel'; model: BreadcrumbPage.Model }
  | { _tag: 'ButtonPageModel'; model: ButtonPage.Model }
  | { _tag: 'CardPageModel'; model: CardPage.Model }
  | { _tag: 'CheckboxPageModel'; model: CheckboxPage.Model }
  | { _tag: 'ColumnsPageModel'; model: ColumnsPage.Model }
  | { _tag: 'ContainerPageModel'; model: ContainerPage.Model }
  | { _tag: 'ContentPageModel'; model: ContentPage.Model }
  | { _tag: 'DeletePageModel'; model: DeletePage.Model }
  | { _tag: 'DropdownPageModel'; model: DropdownPage.Model }
  | { _tag: 'FieldPageModel'; model: FieldPage.Model }
  | { _tag: 'FilePageModel'; model: FilePage.Model }
  | { _tag: 'FooterPageModel'; model: FooterPage.Model }
  | { _tag: 'HeroPageModel'; model: HeroPage.Model }
  | { _tag: 'IconPageModel'; model: IconPage.Model }
  | { _tag: 'ImagePageModel'; model: ImagePage.Model }
  | { _tag: 'InputPageModel'; model: InputPage.Model }
  | { _tag: 'LevelPageModel'; model: LevelPage.Model }
  | { _tag: 'MediaObjectPageModel'; model: MediaObjectPage.Model }
  | { _tag: 'MenuPageModel'; model: MenuPage.Model }
  | { _tag: 'MessagePageModel'; model: MessagePage.Model }
  | { _tag: 'ModalPageModel'; model: ModalPage.Model }
  | { _tag: 'NavbarPageModel'; model: NavbarPage.Model }
  | { _tag: 'NotFoundPageModel'; model: NotFoundPage.Model }
  | { _tag: 'NotificationPageModel'; model: NotificationPage.Model }
  | { _tag: 'PaginationPageModel'; model: PaginationPage.Model }
  | { _tag: 'PanelPageModel'; model: PanelPage.Model }
  | { _tag: 'ProgressPageModel'; model: ProgressPage.Model }
  | { _tag: 'RadioPageModel'; model: RadioPage.Model }
  | { _tag: 'SectionPageModel'; model: SectionPage.Model }
  | { _tag: 'SelectPageModel'; model: SelectPage.Model }
  | { _tag: 'TablePageModel'; model: TablePage.Model }
  | { _tag: 'TabsPageModel'; model: TabsPage.Model }
  | { _tag: 'TagPageModel'; model: TagPage.Model }
  | { _tag: 'TextareaPageModel'; model: TextareaPage.Model }
  | { _tag: 'TitlePageModel'; model: TitlePage.Model }

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
  | { _tag: 'BlockPageMsg'; subMsg: BlockPage.Msg }
  | { _tag: 'BoxPageMsg'; subMsg: BoxPage.Msg }
  | { _tag: 'BreadcrumbPageMsg'; subMsg: BreadcrumbPage.Msg }
  | { _tag: 'ButtonPageMsg'; subMsg: ButtonPage.Msg }
  | { _tag: 'CardPageMsg'; subMsg: CardPage.Msg }
  | { _tag: 'CheckboxPageMsg'; subMsg: CheckboxPage.Msg }
  | { _tag: 'ColumnsPageMsg'; subMsg: ColumnsPage.Msg }
  | { _tag: 'ContainerPageMsg'; subMsg: ContainerPage.Msg }
  | { _tag: 'ContentPageMsg'; subMsg: ContentPage.Msg }
  | { _tag: 'DeletePageMsg'; subMsg: DeletePage.Msg }
  | { _tag: 'DropdownPageMsg'; subMsg: DropdownPage.Msg }
  | { _tag: 'FieldPageMsg'; subMsg: FieldPage.Msg }
  | { _tag: 'FilePageMsg'; subMsg: FilePage.Msg }
  | { _tag: 'FooterPageMsg'; subMsg: FooterPage.Msg }
  | { _tag: 'HeroPageMsg'; subMsg: HeroPage.Msg }
  | { _tag: 'IconPageMsg'; subMsg: IconPage.Msg }
  | { _tag: 'ImagePageMsg'; subMsg: ImagePage.Msg }
  | { _tag: 'InputPageMsg'; subMsg: InputPage.Msg }
  | { _tag: 'LevelPageMsg'; subMsg: LevelPage.Msg }
  | { _tag: 'MediaObjectPageMsg'; subMsg: MediaObjectPage.Msg }
  | { _tag: 'MenuPageMsg'; subMsg: MenuPage.Msg }
  | { _tag: 'MessagePageMsg'; subMsg: MessagePage.Msg }
  | { _tag: 'ModalPageMsg'; subMsg: ModalPage.Msg }
  | { _tag: 'NavbarPageMsg'; subMsg: NavbarPage.Msg }
  | { _tag: 'NotFoundPageMsg'; subMsg: NotFoundPage.Msg }
  | { _tag: 'NotificationPageMsg'; subMsg: NotificationPage.Msg }
  | { _tag: 'PaginationPageMsg'; subMsg: PaginationPage.Msg }
  | { _tag: 'PanelPageMsg'; subMsg: PanelPage.Msg }
  | { _tag: 'ProgressPageMsg'; subMsg: ProgressPage.Msg }
  | { _tag: 'RadioPageMsg'; subMsg: RadioPage.Msg }
  | { _tag: 'SectionPageMsg'; subMsg: SectionPage.Msg }
  | { _tag: 'SelectPageMsg'; subMsg: SelectPage.Msg }
  | { _tag: 'TablePageMsg'; subMsg: TablePage.Msg }
  | { _tag: 'TabsPageMsg'; subMsg: TabsPage.Msg }
  | { _tag: 'TagPageMsg'; subMsg: TagPage.Msg }
  | { _tag: 'TextareaPageMsg'; subMsg: TextareaPage.Msg }
  | { _tag: 'TitlePageMsg'; subMsg: TitlePage.Msg }
  | { _tag: 'NavbarMsg'; subMsg: Navbar.Msg }
  | { _tag: 'MenuMsg'; subMsg: Menu.Msg }
