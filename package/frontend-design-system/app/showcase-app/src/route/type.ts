import * as EqClass from 'fp-ts/lib/Eq'

export type ComponentItem =
  | 'block'
  | 'box'
  | 'button'
  | 'content'
  | 'delete'
  | 'icon'
  | 'image'
  | 'notification'
  | 'progress'
  | 'table'
  | 'tag'
  | 'title'
  | 'breadcrumb'
  | 'card'
  | 'dropdown'
  | 'menu'
  | 'message'
  | 'modal'
  | 'navbar'
  | 'floating-sidebar'
  | 'pagination'
  | 'panel'
  | 'tabs'
  | 'field'
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'container'
  | 'hero'
  | 'section'
  | 'level'
  | 'media-object'
  | 'footer'
  | 'columns'
  | 'dot-loading'

export const ALL_COMPONENT_ITEMS: ComponentItem[] = [
  'block',
  'box',
  'button',
  'content',
  'delete',
  'icon',
  'image',
  'notification',
  'progress',
  'table',
  'tag',
  'title',
  'breadcrumb',
  'card',
  'dropdown',
  'menu',
  'message',
  'modal',
  'navbar',
  'floating-sidebar',
  'pagination',
  'panel',
  'tabs',
  'field',
  'input',
  'textarea',
  'select',
  'checkbox',
  'radio',
  'file',
  'container',
  'hero',
  'section',
  'level',
  'media-object',
  'footer',
  'columns',
  'dot-loading',
]

export type HomePage = { readonly _tag: 'HomePage' }
export type BlockPage = { readonly _tag: 'BlockPage' }
export type BoxPage = { readonly _tag: 'BoxPage' }
export type ButtonPage = { readonly _tag: 'ButtonPage' }
export type ContentPage = { readonly _tag: 'ContentPage' }
export type DeletePage = { readonly _tag: 'DeletePage' }
export type IconPage = { readonly _tag: 'IconPage' }
export type ImagePage = { readonly _tag: 'ImagePage' }
export type NotificationPage = { readonly _tag: 'NotificationPage' }
export type ProgressPage = { readonly _tag: 'ProgressPage' }
export type TablePage = { readonly _tag: 'TablePage' }
export type TagPage = { readonly _tag: 'TagPage' }
export type TitlePage = { readonly _tag: 'TitlePage' }
export type BreadcrumbPage = { readonly _tag: 'BreadcrumbPage' }
export type CardPage = { readonly _tag: 'CardPage' }
export type DropdownPage = { readonly _tag: 'DropdownPage' }
export type MenuPage = { readonly _tag: 'MenuPage' }
export type MessagePage = { readonly _tag: 'MessagePage' }
export type ModalPage = { readonly _tag: 'ModalPage' }
export type NavbarPage = { readonly _tag: 'NavbarPage' }
export type FloatingSidebarPage = { readonly _tag: 'FloatingSidebarPage' }
export type PaginationPage = { readonly _tag: 'PaginationPage' }
export type PanelPage = { readonly _tag: 'PanelPage' }
export type TabsPage = { readonly _tag: 'TabsPage' }
export type FieldPage = { readonly _tag: 'FieldPage' }
export type InputPage = { readonly _tag: 'InputPage' }
export type TextareaPage = { readonly _tag: 'TextareaPage' }
export type SelectPage = { readonly _tag: 'SelectPage' }
export type CheckboxPage = { readonly _tag: 'CheckboxPage' }
export type RadioPage = { readonly _tag: 'RadioPage' }
export type FilePage = { readonly _tag: 'FilePage' }
export type ContainerPage = { readonly _tag: 'ContainerPage' }
export type HeroPage = { readonly _tag: 'HeroPage' }
export type SectionPage = { readonly _tag: 'SectionPage' }
export type LevelPage = { readonly _tag: 'LevelPage' }
export type MediaObjectPage = { readonly _tag: 'MediaObjectPage' }
export type FooterPage = { readonly _tag: 'FooterPage' }
export type ColumnsPage = { readonly _tag: 'ColumnsPage' }
export type DotLoadingPage = { readonly _tag: 'DotLoadingPage' }
export type NotFoundPage = { readonly _tag: 'NotFoundPage' }

export type AppPage =
  | HomePage
  | BlockPage
  | BoxPage
  | ButtonPage
  | ContentPage
  | DeletePage
  | IconPage
  | ImagePage
  | NotificationPage
  | ProgressPage
  | TablePage
  | TagPage
  | TitlePage
  | BreadcrumbPage
  | CardPage
  | DropdownPage
  | MenuPage
  | MessagePage
  | ModalPage
  | NavbarPage
  | FloatingSidebarPage
  | PaginationPage
  | PanelPage
  | TabsPage
  | FieldPage
  | InputPage
  | TextareaPage
  | SelectPage
  | CheckboxPage
  | RadioPage
  | FilePage
  | ContainerPage
  | HeroPage
  | SectionPage
  | LevelPage
  | MediaObjectPage
  | FooterPage
  | ColumnsPage
  | DotLoadingPage
  | NotFoundPage

export type AppRoute = {
  page: AppPage
}

export const homePage = (): HomePage => ({ _tag: 'HomePage' })
export const blockPage = (): BlockPage => ({ _tag: 'BlockPage' })
export const boxPage = (): BoxPage => ({ _tag: 'BoxPage' })
export const buttonPage = (): ButtonPage => ({ _tag: 'ButtonPage' })
export const contentPage = (): ContentPage => ({ _tag: 'ContentPage' })
export const deletePage = (): DeletePage => ({ _tag: 'DeletePage' })
export const iconPage = (): IconPage => ({ _tag: 'IconPage' })
export const imagePage = (): ImagePage => ({ _tag: 'ImagePage' })
export const notificationPage = (): NotificationPage => ({
  _tag: 'NotificationPage',
})
export const progressPage = (): ProgressPage => ({ _tag: 'ProgressPage' })
export const tablePage = (): TablePage => ({ _tag: 'TablePage' })
export const tagPage = (): TagPage => ({ _tag: 'TagPage' })
export const titlePage = (): TitlePage => ({ _tag: 'TitlePage' })
export const breadcrumbPage = (): BreadcrumbPage => ({
  _tag: 'BreadcrumbPage',
})
export const cardPage = (): CardPage => ({ _tag: 'CardPage' })
export const dropdownPage = (): DropdownPage => ({ _tag: 'DropdownPage' })
export const menuPage = (): MenuPage => ({ _tag: 'MenuPage' })
export const messagePage = (): MessagePage => ({ _tag: 'MessagePage' })
export const modalPage = (): ModalPage => ({ _tag: 'ModalPage' })
export const navbarPage = (): NavbarPage => ({ _tag: 'NavbarPage' })
export const floatingSidebarPage = (): FloatingSidebarPage => ({
  _tag: 'FloatingSidebarPage',
})
export const paginationPage = (): PaginationPage => ({
  _tag: 'PaginationPage',
})
export const panelPage = (): PanelPage => ({ _tag: 'PanelPage' })
export const tabsPage = (): TabsPage => ({ _tag: 'TabsPage' })
export const fieldPage = (): FieldPage => ({ _tag: 'FieldPage' })
export const inputPage = (): InputPage => ({ _tag: 'InputPage' })
export const textareaPage = (): TextareaPage => ({ _tag: 'TextareaPage' })
export const selectPage = (): SelectPage => ({ _tag: 'SelectPage' })
export const checkboxPage = (): CheckboxPage => ({ _tag: 'CheckboxPage' })
export const radioPage = (): RadioPage => ({ _tag: 'RadioPage' })
export const filePage = (): FilePage => ({ _tag: 'FilePage' })
export const containerPage = (): ContainerPage => ({ _tag: 'ContainerPage' })
export const heroPage = (): HeroPage => ({ _tag: 'HeroPage' })
export const sectionPage = (): SectionPage => ({ _tag: 'SectionPage' })
export const levelPage = (): LevelPage => ({ _tag: 'LevelPage' })
export const mediaObjectPage = (): MediaObjectPage => ({
  _tag: 'MediaObjectPage',
})
export const footerPage = (): FooterPage => ({ _tag: 'FooterPage' })
export const columnsPage = (): ColumnsPage => ({ _tag: 'ColumnsPage' })
export const dotLoadingPage = (): DotLoadingPage => ({
  _tag: 'DotLoadingPage',
})
export const notFoundPage = (): NotFoundPage => ({ _tag: 'NotFoundPage' })

export const AppPageEq: EqClass.Eq<AppPage> = {
  equals: (x, y) => x._tag === y._tag,
}

export const AppRouteEq: EqClass.Eq<AppRoute> = EqClass.struct({
  page: AppPageEq,
})
