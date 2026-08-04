import type * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import type * as DsSidebar from '@rinn7e/realworld-design-system/component/sidebar'

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
import type * as DotLoadingPage from './page/dot-loading/type'
import type * as DropdownPage from './page/dropdown/type'
import type * as FieldPage from './page/field/type'
import type * as FilePage from './page/file/type'
import type * as FloatingSidebarPage from './page/floating-sidebar/type'
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
import type * as SidebarPage from './page/sidebar/type'
import type * as TablePage from './page/table/type'
import type * as TabsPage from './page/tabs/type'
import type * as TagPage from './page/tag/type'
import type * as TextareaPage from './page/textarea/type'
import type * as TitlePage from './page/title/type'
import type { AppRoute } from './route/type'
import type { ColorScheme } from './util/theme-util'

export type SectionCategory =
  'elements' | 'components' | 'form' | 'layout' | 'grid' | 'misc'

export type PageModel =
  | { readonly _tag: 'HomePageModel'; readonly model: HomePage.Model }
  | { readonly _tag: 'BlockPageModel'; readonly model: BlockPage.Model }
  | { readonly _tag: 'BoxPageModel'; readonly model: BoxPage.Model }
  | {
      readonly _tag: 'BreadcrumbPageModel'
      readonly model: BreadcrumbPage.Model
    }
  | { readonly _tag: 'ButtonPageModel'; readonly model: ButtonPage.Model }
  | { readonly _tag: 'CardPageModel'; readonly model: CardPage.Model }
  | { readonly _tag: 'CheckboxPageModel'; readonly model: CheckboxPage.Model }
  | { readonly _tag: 'ColumnsPageModel'; readonly model: ColumnsPage.Model }
  | {
      readonly _tag: 'ContainerPageModel'
      readonly model: ContainerPage.Model
    }
  | { readonly _tag: 'ContentPageModel'; readonly model: ContentPage.Model }
  | { readonly _tag: 'DeletePageModel'; readonly model: DeletePage.Model }
  | {
      readonly _tag: 'DotLoadingPageModel'
      readonly model: DotLoadingPage.Model
    }
  | { readonly _tag: 'DropdownPageModel'; readonly model: DropdownPage.Model }
  | { readonly _tag: 'FieldPageModel'; readonly model: FieldPage.Model }
  | { readonly _tag: 'FilePageModel'; readonly model: FilePage.Model }
  | { readonly _tag: 'FooterPageModel'; readonly model: FooterPage.Model }
  | { readonly _tag: 'HeroPageModel'; readonly model: HeroPage.Model }
  | { readonly _tag: 'IconPageModel'; readonly model: IconPage.Model }
  | { readonly _tag: 'ImagePageModel'; readonly model: ImagePage.Model }
  | { readonly _tag: 'InputPageModel'; readonly model: InputPage.Model }
  | { readonly _tag: 'LevelPageModel'; readonly model: LevelPage.Model }
  | {
      readonly _tag: 'MediaObjectPageModel'
      readonly model: MediaObjectPage.Model
    }
  | { readonly _tag: 'MenuPageModel'; readonly model: MenuPage.Model }
  | { readonly _tag: 'MessagePageModel'; readonly model: MessagePage.Model }
  | { readonly _tag: 'ModalPageModel'; readonly model: ModalPage.Model }
  | { readonly _tag: 'NavbarPageModel'; readonly model: NavbarPage.Model }
  | {
      readonly _tag: 'FloatingSidebarPageModel'
      readonly model: FloatingSidebarPage.Model
    }
  | { readonly _tag: 'SidebarPageModel'; readonly model: SidebarPage.Model }
  | {
      readonly _tag: 'NotificationPageModel'
      readonly model: NotificationPage.Model
    }
  | {
      readonly _tag: 'PaginationPageModel'
      readonly model: PaginationPage.Model
    }
  | { readonly _tag: 'PanelPageModel'; readonly model: PanelPage.Model }
  | { readonly _tag: 'ProgressPageModel'; readonly model: ProgressPage.Model }
  | { readonly _tag: 'RadioPageModel'; readonly model: RadioPage.Model }
  | { readonly _tag: 'SectionPageModel'; readonly model: SectionPage.Model }
  | { readonly _tag: 'SelectPageModel'; readonly model: SelectPage.Model }
  | { readonly _tag: 'TablePageModel'; readonly model: TablePage.Model }
  | { readonly _tag: 'TabsPageModel'; readonly model: TabsPage.Model }
  | { readonly _tag: 'TagPageModel'; readonly model: TagPage.Model }
  | { readonly _tag: 'TextareaPageModel'; readonly model: TextareaPage.Model }
  | { readonly _tag: 'TitlePageModel'; readonly model: TitlePage.Model }
  | { readonly _tag: 'NotFoundPageModel'; readonly model: NotFoundPage.Model }

export type Model = {
  readonly route: AppRoute
  readonly isInternal: boolean
  readonly pageModel: PageModel
  readonly searchQuery: string
  readonly sidebarModel: DsSidebar.Model
  readonly rightSidebarModel: DsSidebar.Model
  readonly colorScheme: ColorScheme
}

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'Init'; readonly location: Location }
  | { readonly _tag: 'UrlChange'; readonly location: Location }
  | { readonly _tag: 'ChangeRoute'; readonly route: AppRoute }
  | { readonly _tag: 'UpdateSearch'; readonly query: string }
  | { readonly _tag: 'SetColorScheme'; readonly scheme: ColorScheme }
  | { readonly _tag: 'SidebarMsg'; readonly subMsg: DsSidebar.Msg }
  | { readonly _tag: 'RightSidebarMsg'; readonly subMsg: DsSidebar.Msg }
  | { readonly _tag: 'TopNavbarMsg'; readonly subMsg: DsNavbar.Msg }
  | { readonly _tag: 'HomePageMsg'; readonly subMsg: HomePage.Msg }
  | { readonly _tag: 'BlockPageMsg'; readonly subMsg: BlockPage.Msg }
  | { readonly _tag: 'BoxPageMsg'; readonly subMsg: BoxPage.Msg }
  | { readonly _tag: 'BreadcrumbPageMsg'; readonly subMsg: BreadcrumbPage.Msg }
  | { readonly _tag: 'ButtonPageMsg'; readonly subMsg: ButtonPage.Msg }
  | { readonly _tag: 'CardPageMsg'; readonly subMsg: CardPage.Msg }
  | { readonly _tag: 'CheckboxPageMsg'; readonly subMsg: CheckboxPage.Msg }
  | { readonly _tag: 'ColumnsPageMsg'; readonly subMsg: ColumnsPage.Msg }
  | { readonly _tag: 'ContainerPageMsg'; readonly subMsg: ContainerPage.Msg }
  | { readonly _tag: 'ContentPageMsg'; readonly subMsg: ContentPage.Msg }
  | { readonly _tag: 'DeletePageMsg'; readonly subMsg: DeletePage.Msg }
  | { readonly _tag: 'DotLoadingPageMsg'; readonly subMsg: DotLoadingPage.Msg }
  | { readonly _tag: 'DropdownPageMsg'; readonly subMsg: DropdownPage.Msg }
  | { readonly _tag: 'FieldPageMsg'; readonly subMsg: FieldPage.Msg }
  | { readonly _tag: 'FilePageMsg'; readonly subMsg: FilePage.Msg }
  | { readonly _tag: 'FooterPageMsg'; readonly subMsg: FooterPage.Msg }
  | { readonly _tag: 'HeroPageMsg'; readonly subMsg: HeroPage.Msg }
  | { readonly _tag: 'IconPageMsg'; readonly subMsg: IconPage.Msg }
  | { readonly _tag: 'ImagePageMsg'; readonly subMsg: ImagePage.Msg }
  | { readonly _tag: 'InputPageMsg'; readonly subMsg: InputPage.Msg }
  | { readonly _tag: 'LevelPageMsg'; readonly subMsg: LevelPage.Msg }
  | {
      readonly _tag: 'MediaObjectPageMsg'
      readonly subMsg: MediaObjectPage.Msg
    }
  | { readonly _tag: 'MenuPageMsg'; readonly subMsg: MenuPage.Msg }
  | { readonly _tag: 'MessagePageMsg'; readonly subMsg: MessagePage.Msg }
  | { readonly _tag: 'ModalPageMsg'; readonly subMsg: ModalPage.Msg }
  | { readonly _tag: 'NavbarPageMsg'; readonly subMsg: NavbarPage.Msg }
  | {
      readonly _tag: 'FloatingSidebarPageMsg'
      readonly subMsg: FloatingSidebarPage.Msg
    }
  | { readonly _tag: 'SidebarPageMsg'; readonly subMsg: SidebarPage.Msg }
  | {
      readonly _tag: 'NotificationPageMsg'
      readonly subMsg: NotificationPage.Msg
    }
  | { readonly _tag: 'PaginationPageMsg'; readonly subMsg: PaginationPage.Msg }
  | { readonly _tag: 'PanelPageMsg'; readonly subMsg: PanelPage.Msg }
  | { readonly _tag: 'ProgressPageMsg'; readonly subMsg: ProgressPage.Msg }
  | { readonly _tag: 'RadioPageMsg'; readonly subMsg: RadioPage.Msg }
  | { readonly _tag: 'SectionPageMsg'; readonly subMsg: SectionPage.Msg }
  | { readonly _tag: 'SelectPageMsg'; readonly subMsg: SelectPage.Msg }
  | { readonly _tag: 'TablePageMsg'; readonly subMsg: TablePage.Msg }
  | { readonly _tag: 'TabsPageMsg'; readonly subMsg: TabsPage.Msg }
  | { readonly _tag: 'TagPageMsg'; readonly subMsg: TagPage.Msg }
  | { readonly _tag: 'TextareaPageMsg'; readonly subMsg: TextareaPage.Msg }
  | { readonly _tag: 'TitlePageMsg'; readonly subMsg: TitlePage.Msg }
  | { readonly _tag: 'NotFoundPageMsg'; readonly subMsg: NotFoundPage.Msg }
