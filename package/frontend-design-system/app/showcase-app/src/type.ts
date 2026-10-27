import type * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import type * as DsSidebar from '@rinn7e/realworld-design-system/component/sidebar'
import type * as TeaRouter from '@rinn7e/tea-cup-router'

import type { AppRoute } from '@/common/type/route'
import type * as BlockScreen from '@/screen/block-screen'
import type * as BoxScreen from '@/screen/box-screen'
import type * as BreadcrumbScreen from '@/screen/breadcrumb-screen'
import type * as ButtonScreen from '@/screen/button-screen'
import type * as CardScreen from '@/screen/card-screen'
import type * as CheckboxScreen from '@/screen/checkbox-screen'
import type * as ColumnsScreen from '@/screen/columns-screen'
import type * as ContainerScreen from '@/screen/container-screen'
import type * as ContentScreen from '@/screen/content-screen'
import type * as DeleteScreen from '@/screen/delete-screen'
import type * as DotLoadingScreen from '@/screen/dot-loading-screen'
import type * as DropdownScreen from '@/screen/dropdown-screen'
import type * as FieldScreen from '@/screen/field-screen'
import type * as FileScreen from '@/screen/file-screen'
import type * as FloatingSidebarScreen from '@/screen/floating-sidebar-screen'
import type * as FooterScreen from '@/screen/footer-screen'
import type * as HeroScreen from '@/screen/hero-screen'
import type * as HomeScreen from '@/screen/home-screen'
import type * as IconScreen from '@/screen/icon-screen'
import type * as ImageScreen from '@/screen/image-screen'
import type * as InputScreen from '@/screen/input-screen'
import type * as LevelScreen from '@/screen/level-screen'
import type * as MediaObjectScreen from '@/screen/media-object-screen'
import type * as MenuScreen from '@/screen/menu-screen'
import type * as MessageScreen from '@/screen/message-screen'
import type * as ModalScreen from '@/screen/modal-screen'
import type * as NavbarScreen from '@/screen/navbar-screen'
import type * as NotFoundScreen from '@/screen/not-found-screen'
import type * as NotificationScreen from '@/screen/notification-screen'
import type * as PaginationScreen from '@/screen/pagination-screen'
import type * as PanelScreen from '@/screen/panel-screen'
import type * as PopoverScreen from '@/screen/popover-screen'
import type * as ProgressScreen from '@/screen/progress-screen'
import type * as RadioScreen from '@/screen/radio-screen'
import type * as SectionScreen from '@/screen/section-screen'
import type * as SelectScreen from '@/screen/select-screen'
import type * as SidebarScreen from '@/screen/sidebar-screen'
import type * as TableScreen from '@/screen/table-screen'
import type * as TabsScreen from '@/screen/tabs-screen'
import type * as TagScreen from '@/screen/tag-screen'
import type * as TextareaScreen from '@/screen/textarea-screen'
import type * as TitleScreen from '@/screen/title-screen'
import type { ColorScheme } from '@/theme/type'

export type ScreenModel =
  | { readonly _tag: 'HomeScreenModel'; readonly model: HomeScreen.Model }
  | { readonly _tag: 'BlockScreenModel'; readonly model: BlockScreen.Model }
  | { readonly _tag: 'BoxScreenModel'; readonly model: BoxScreen.Model }
  | {
      readonly _tag: 'BreadcrumbScreenModel'
      readonly model: BreadcrumbScreen.Model
    }
  | { readonly _tag: 'ButtonScreenModel'; readonly model: ButtonScreen.Model }
  | { readonly _tag: 'CardScreenModel'; readonly model: CardScreen.Model }
  | {
      readonly _tag: 'CheckboxScreenModel'
      readonly model: CheckboxScreen.Model
    }
  | { readonly _tag: 'ColumnsScreenModel'; readonly model: ColumnsScreen.Model }
  | {
      readonly _tag: 'ContainerScreenModel'
      readonly model: ContainerScreen.Model
    }
  | { readonly _tag: 'ContentScreenModel'; readonly model: ContentScreen.Model }
  | { readonly _tag: 'DeleteScreenModel'; readonly model: DeleteScreen.Model }
  | {
      readonly _tag: 'DotLoadingScreenModel'
      readonly model: DotLoadingScreen.Model
    }
  | {
      readonly _tag: 'DropdownScreenModel'
      readonly model: DropdownScreen.Model
    }
  | { readonly _tag: 'FieldScreenModel'; readonly model: FieldScreen.Model }
  | { readonly _tag: 'FileScreenModel'; readonly model: FileScreen.Model }
  | { readonly _tag: 'FooterScreenModel'; readonly model: FooterScreen.Model }
  | { readonly _tag: 'HeroScreenModel'; readonly model: HeroScreen.Model }
  | { readonly _tag: 'IconScreenModel'; readonly model: IconScreen.Model }
  | { readonly _tag: 'ImageScreenModel'; readonly model: ImageScreen.Model }
  | { readonly _tag: 'InputScreenModel'; readonly model: InputScreen.Model }
  | { readonly _tag: 'LevelScreenModel'; readonly model: LevelScreen.Model }
  | {
      readonly _tag: 'MediaObjectScreenModel'
      readonly model: MediaObjectScreen.Model
    }
  | { readonly _tag: 'MenuScreenModel'; readonly model: MenuScreen.Model }
  | { readonly _tag: 'MessageScreenModel'; readonly model: MessageScreen.Model }
  | { readonly _tag: 'ModalScreenModel'; readonly model: ModalScreen.Model }
  | { readonly _tag: 'NavbarScreenModel'; readonly model: NavbarScreen.Model }
  | {
      readonly _tag: 'FloatingSidebarScreenModel'
      readonly model: FloatingSidebarScreen.Model
    }
  | { readonly _tag: 'SidebarScreenModel'; readonly model: SidebarScreen.Model }
  | {
      readonly _tag: 'NotificationScreenModel'
      readonly model: NotificationScreen.Model
    }
  | {
      readonly _tag: 'PaginationScreenModel'
      readonly model: PaginationScreen.Model
    }
  | { readonly _tag: 'PanelScreenModel'; readonly model: PanelScreen.Model }
  | { readonly _tag: 'PopoverScreenModel'; readonly model: PopoverScreen.Model }
  | {
      readonly _tag: 'ProgressScreenModel'
      readonly model: ProgressScreen.Model
    }
  | { readonly _tag: 'RadioScreenModel'; readonly model: RadioScreen.Model }
  | { readonly _tag: 'SectionScreenModel'; readonly model: SectionScreen.Model }
  | { readonly _tag: 'SelectScreenModel'; readonly model: SelectScreen.Model }
  | { readonly _tag: 'TableScreenModel'; readonly model: TableScreen.Model }
  | { readonly _tag: 'TabsScreenModel'; readonly model: TabsScreen.Model }
  | { readonly _tag: 'TagScreenModel'; readonly model: TagScreen.Model }
  | {
      readonly _tag: 'TextareaScreenModel'
      readonly model: TextareaScreen.Model
    }
  | { readonly _tag: 'TitleScreenModel'; readonly model: TitleScreen.Model }
  | {
      readonly _tag: 'NotFoundScreenModel'
      readonly model: NotFoundScreen.Model
    }

export type Model = {
  readonly router: TeaRouter.Model<AppRoute, ScreenModel>
  readonly searchQuery: string
  readonly sidebarModel: DsSidebar.Model
  readonly rightSidebarModel: DsSidebar.Model
  readonly topNavbarModel: DsNavbar.Model
  readonly colorScheme: ColorScheme
  readonly isThemeMenuOpen: boolean
}

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'Init'; readonly location: Location }
  | {
      readonly _tag: 'TeaRouterMsg'
      readonly subMsg: TeaRouter.Msg<AppRoute>
    }
  | { readonly _tag: 'UpdateSearch'; readonly query: string }
  | { readonly _tag: 'SetColorScheme'; readonly scheme: ColorScheme }
  | { readonly _tag: 'ToggleThemeMenu' }
  | { readonly _tag: 'CloseThemeMenu' }
  | { readonly _tag: 'SidebarMsg'; readonly subMsg: DsSidebar.Msg }
  | { readonly _tag: 'RightSidebarMsg'; readonly subMsg: DsSidebar.Msg }
  | { readonly _tag: 'TopNavbarMsg'; readonly subMsg: DsNavbar.Msg }
  | { readonly _tag: 'HomeScreenMsg'; readonly subMsg: HomeScreen.Msg }
  | { readonly _tag: 'BlockScreenMsg'; readonly subMsg: BlockScreen.Msg }
  | { readonly _tag: 'BoxScreenMsg'; readonly subMsg: BoxScreen.Msg }
  | {
      readonly _tag: 'BreadcrumbScreenMsg'
      readonly subMsg: BreadcrumbScreen.Msg
    }
  | { readonly _tag: 'ButtonScreenMsg'; readonly subMsg: ButtonScreen.Msg }
  | { readonly _tag: 'CardScreenMsg'; readonly subMsg: CardScreen.Msg }
  | { readonly _tag: 'CheckboxScreenMsg'; readonly subMsg: CheckboxScreen.Msg }
  | { readonly _tag: 'ColumnsScreenMsg'; readonly subMsg: ColumnsScreen.Msg }
  | {
      readonly _tag: 'ContainerScreenMsg'
      readonly subMsg: ContainerScreen.Msg
    }
  | { readonly _tag: 'ContentScreenMsg'; readonly subMsg: ContentScreen.Msg }
  | { readonly _tag: 'DeleteScreenMsg'; readonly subMsg: DeleteScreen.Msg }
  | {
      readonly _tag: 'DotLoadingScreenMsg'
      readonly subMsg: DotLoadingScreen.Msg
    }
  | { readonly _tag: 'DropdownScreenMsg'; readonly subMsg: DropdownScreen.Msg }
  | { readonly _tag: 'FieldScreenMsg'; readonly subMsg: FieldScreen.Msg }
  | { readonly _tag: 'FileScreenMsg'; readonly subMsg: FileScreen.Msg }
  | { readonly _tag: 'FooterScreenMsg'; readonly subMsg: FooterScreen.Msg }
  | { readonly _tag: 'HeroScreenMsg'; readonly subMsg: HeroScreen.Msg }
  | { readonly _tag: 'IconScreenMsg'; readonly subMsg: IconScreen.Msg }
  | { readonly _tag: 'ImageScreenMsg'; readonly subMsg: ImageScreen.Msg }
  | { readonly _tag: 'InputScreenMsg'; readonly subMsg: InputScreen.Msg }
  | { readonly _tag: 'LevelScreenMsg'; readonly subMsg: LevelScreen.Msg }
  | {
      readonly _tag: 'MediaObjectScreenMsg'
      readonly subMsg: MediaObjectScreen.Msg
    }
  | { readonly _tag: 'MenuScreenMsg'; readonly subMsg: MenuScreen.Msg }
  | { readonly _tag: 'MessageScreenMsg'; readonly subMsg: MessageScreen.Msg }
  | { readonly _tag: 'ModalScreenMsg'; readonly subMsg: ModalScreen.Msg }
  | { readonly _tag: 'NavbarScreenMsg'; readonly subMsg: NavbarScreen.Msg }
  | {
      readonly _tag: 'FloatingSidebarScreenMsg'
      readonly subMsg: FloatingSidebarScreen.Msg
    }
  | { readonly _tag: 'SidebarScreenMsg'; readonly subMsg: SidebarScreen.Msg }
  | {
      readonly _tag: 'NotificationScreenMsg'
      readonly subMsg: NotificationScreen.Msg
    }
  | {
      readonly _tag: 'PaginationScreenMsg'
      readonly subMsg: PaginationScreen.Msg
    }
  | { readonly _tag: 'PanelScreenMsg'; readonly subMsg: PanelScreen.Msg }
  | { readonly _tag: 'PopoverScreenMsg'; readonly subMsg: PopoverScreen.Msg }
  | { readonly _tag: 'ProgressScreenMsg'; readonly subMsg: ProgressScreen.Msg }
  | { readonly _tag: 'RadioScreenMsg'; readonly subMsg: RadioScreen.Msg }
  | { readonly _tag: 'SectionScreenMsg'; readonly subMsg: SectionScreen.Msg }
  | { readonly _tag: 'SelectScreenMsg'; readonly subMsg: SelectScreen.Msg }
  | { readonly _tag: 'TableScreenMsg'; readonly subMsg: TableScreen.Msg }
  | { readonly _tag: 'TabsScreenMsg'; readonly subMsg: TabsScreen.Msg }
  | { readonly _tag: 'TagScreenMsg'; readonly subMsg: TagScreen.Msg }
  | { readonly _tag: 'TextareaScreenMsg'; readonly subMsg: TextareaScreen.Msg }
  | { readonly _tag: 'TitleScreenMsg'; readonly subMsg: TitleScreen.Msg }
  | { readonly _tag: 'NotFoundScreenMsg'; readonly subMsg: NotFoundScreen.Msg }

export const teaRouterMsg = (subMsg: TeaRouter.Msg<AppRoute>): Msg => ({
  _tag: 'TeaRouterMsg',
  subMsg,
})
