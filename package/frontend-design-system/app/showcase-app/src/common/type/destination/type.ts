import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'

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
  | 'sidebar'
  | 'pagination'
  | 'panel'
  | 'popover'
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
  'sidebar',
  'pagination',
  'panel',
  'popover',
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

export type Screen =
  | { readonly _tag: 'HomeScreen' }
  | { readonly _tag: 'BlockScreen' }
  | { readonly _tag: 'BoxScreen' }
  | { readonly _tag: 'ButtonScreen' }
  | { readonly _tag: 'ContentScreen' }
  | { readonly _tag: 'DeleteScreen' }
  | { readonly _tag: 'IconScreen' }
  | { readonly _tag: 'ImageScreen' }
  | { readonly _tag: 'NotificationScreen' }
  | { readonly _tag: 'ProgressScreen' }
  | { readonly _tag: 'TableScreen' }
  | { readonly _tag: 'TagScreen' }
  | { readonly _tag: 'TitleScreen' }
  | { readonly _tag: 'BreadcrumbScreen' }
  | { readonly _tag: 'CardScreen' }
  | { readonly _tag: 'DropdownScreen' }
  | { readonly _tag: 'MenuScreen' }
  | { readonly _tag: 'MessageScreen' }
  | { readonly _tag: 'ModalScreen' }
  | { readonly _tag: 'NavbarScreen' }
  | { readonly _tag: 'FloatingSidebarScreen' }
  | { readonly _tag: 'SidebarScreen' }
  | { readonly _tag: 'PaginationScreen' }
  | { readonly _tag: 'PanelScreen' }
  | { readonly _tag: 'PopoverScreen' }
  | { readonly _tag: 'TabsScreen' }
  | { readonly _tag: 'FieldScreen' }
  | { readonly _tag: 'InputScreen' }
  | { readonly _tag: 'TextareaScreen' }
  | { readonly _tag: 'SelectScreen' }
  | { readonly _tag: 'CheckboxScreen' }
  | { readonly _tag: 'RadioScreen' }
  | { readonly _tag: 'FileScreen' }
  | { readonly _tag: 'ContainerScreen' }
  | { readonly _tag: 'HeroScreen' }
  | { readonly _tag: 'SectionScreen' }
  | { readonly _tag: 'LevelScreen' }
  | { readonly _tag: 'MediaObjectScreen' }
  | { readonly _tag: 'FooterScreen' }
  | { readonly _tag: 'ColumnsScreen' }
  | { readonly _tag: 'DotLoadingScreen' }
  | { readonly _tag: 'NotFoundScreen' }

// Where the app is. Never stored: read from the models that show it
// (`destinationOf`), and written to the URL from there.
export type Destination = {
  readonly screen: Screen
}

export const homeScreen = (): Screen => ({ _tag: 'HomeScreen' })
export const blockScreen = (): Screen => ({ _tag: 'BlockScreen' })
export const boxScreen = (): Screen => ({ _tag: 'BoxScreen' })
export const buttonScreen = (): Screen => ({ _tag: 'ButtonScreen' })
export const contentScreen = (): Screen => ({ _tag: 'ContentScreen' })
export const deleteScreen = (): Screen => ({ _tag: 'DeleteScreen' })
export const iconScreen = (): Screen => ({ _tag: 'IconScreen' })
export const imageScreen = (): Screen => ({ _tag: 'ImageScreen' })
export const notificationScreen = (): Screen => ({ _tag: 'NotificationScreen' })
export const progressScreen = (): Screen => ({ _tag: 'ProgressScreen' })
export const tableScreen = (): Screen => ({ _tag: 'TableScreen' })
export const tagScreen = (): Screen => ({ _tag: 'TagScreen' })
export const titleScreen = (): Screen => ({ _tag: 'TitleScreen' })
export const breadcrumbScreen = (): Screen => ({ _tag: 'BreadcrumbScreen' })
export const cardScreen = (): Screen => ({ _tag: 'CardScreen' })
export const dropdownScreen = (): Screen => ({ _tag: 'DropdownScreen' })
export const menuScreen = (): Screen => ({ _tag: 'MenuScreen' })
export const messageScreen = (): Screen => ({ _tag: 'MessageScreen' })
export const modalScreen = (): Screen => ({ _tag: 'ModalScreen' })
export const navbarScreen = (): Screen => ({ _tag: 'NavbarScreen' })
export const floatingSidebarScreen = (): Screen => ({
  _tag: 'FloatingSidebarScreen',
})
export const sidebarScreen = (): Screen => ({ _tag: 'SidebarScreen' })
export const paginationScreen = (): Screen => ({ _tag: 'PaginationScreen' })
export const panelScreen = (): Screen => ({ _tag: 'PanelScreen' })
export const popoverScreen = (): Screen => ({ _tag: 'PopoverScreen' })
export const tabsScreen = (): Screen => ({ _tag: 'TabsScreen' })
export const fieldScreen = (): Screen => ({ _tag: 'FieldScreen' })
export const inputScreen = (): Screen => ({ _tag: 'InputScreen' })
export const textareaScreen = (): Screen => ({ _tag: 'TextareaScreen' })
export const selectScreen = (): Screen => ({ _tag: 'SelectScreen' })
export const checkboxScreen = (): Screen => ({ _tag: 'CheckboxScreen' })
export const radioScreen = (): Screen => ({ _tag: 'RadioScreen' })
export const fileScreen = (): Screen => ({ _tag: 'FileScreen' })
export const containerScreen = (): Screen => ({ _tag: 'ContainerScreen' })
export const heroScreen = (): Screen => ({ _tag: 'HeroScreen' })
export const sectionScreen = (): Screen => ({ _tag: 'SectionScreen' })
export const levelScreen = (): Screen => ({ _tag: 'LevelScreen' })
export const mediaObjectScreen = (): Screen => ({ _tag: 'MediaObjectScreen' })
export const footerScreen = (): Screen => ({ _tag: 'FooterScreen' })
export const columnsScreen = (): Screen => ({ _tag: 'ColumnsScreen' })
export const dotLoadingScreen = (): Screen => ({ _tag: 'DotLoadingScreen' })
export const notFoundScreen = (): Screen => ({ _tag: 'NotFoundScreen' })

// No screen has a param, so the tag is the whole screen
export const ScreenEq: EqClass.Eq<Screen> = {
  equals: (x, y) => x._tag === y._tag,
}

export const DestinationEq: EqClass.Eq<Destination> = EqClass.struct({
  screen: ScreenEq,
})

export const destinationOfScreen = (screen: Screen): Destination => ({
  screen,
})

export const defaultDestination = (): Destination =>
  destinationOfScreen(homeScreen())

// The screen of each component item of the menu (its id)
export const ITEM_SCREENS: Record<ComponentItem, Screen> = {
  block: blockScreen(),
  box: boxScreen(),
  button: buttonScreen(),
  content: contentScreen(),
  delete: deleteScreen(),
  icon: iconScreen(),
  image: imageScreen(),
  notification: notificationScreen(),
  progress: progressScreen(),
  table: tableScreen(),
  tag: tagScreen(),
  title: titleScreen(),
  breadcrumb: breadcrumbScreen(),
  card: cardScreen(),
  dropdown: dropdownScreen(),
  menu: menuScreen(),
  message: messageScreen(),
  modal: modalScreen(),
  navbar: navbarScreen(),
  'floating-sidebar': floatingSidebarScreen(),
  sidebar: sidebarScreen(),
  pagination: paginationScreen(),
  panel: panelScreen(),
  popover: popoverScreen(),
  tabs: tabsScreen(),
  field: fieldScreen(),
  input: inputScreen(),
  textarea: textareaScreen(),
  select: selectScreen(),
  checkbox: checkboxScreen(),
  radio: radioScreen(),
  file: fileScreen(),
  container: containerScreen(),
  hero: heroScreen(),
  section: sectionScreen(),
  level: levelScreen(),
  'media-object': mediaObjectScreen(),
  footer: footerScreen(),
  columns: columnsScreen(),
  'dot-loading': dotLoadingScreen(),
}

// The component item a screen shows, if any (not home or not found)
export const itemOfScreen = (screen: Screen): O.Option<ComponentItem> =>
  pipe(
    ALL_COMPONENT_ITEMS,
    A.findFirst((item) => ScreenEq.equals(ITEM_SCREENS[item], screen)),
  )

// Every move of the app goes through `navigationMsgHandler`. `UrlChanged`
// is the browser's back or forward, the only move that comes from the URL
// after the boot.
export type NavigationMsg =
  | {
      readonly _tag: 'Navigate'
      readonly destination: Destination
      readonly forceRefresh?: boolean
    }
  | {
      readonly _tag: 'ModifyDestination'
      readonly func: (destination: Destination) => Destination
      readonly forceRefresh?: boolean
    }
  | { readonly _tag: 'Refresh' }
  | { readonly _tag: 'UrlChanged'; readonly destination: Destination }
