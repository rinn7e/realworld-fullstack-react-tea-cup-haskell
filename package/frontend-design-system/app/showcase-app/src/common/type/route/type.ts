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

export type PageHome = { readonly _tag: 'PageHome' }
export type PageBlock = { readonly _tag: 'PageBlock' }
export type PageBox = { readonly _tag: 'PageBox' }
export type PageButton = { readonly _tag: 'PageButton' }
export type PageContent = { readonly _tag: 'PageContent' }
export type PageDelete = { readonly _tag: 'PageDelete' }
export type PageIcon = { readonly _tag: 'PageIcon' }
export type PageImage = { readonly _tag: 'PageImage' }
export type PageNotification = { readonly _tag: 'PageNotification' }
export type PageProgress = { readonly _tag: 'PageProgress' }
export type PageTable = { readonly _tag: 'PageTable' }
export type PageTag = { readonly _tag: 'PageTag' }
export type PageTitle = { readonly _tag: 'PageTitle' }
export type PageBreadcrumb = { readonly _tag: 'PageBreadcrumb' }
export type PageCard = { readonly _tag: 'PageCard' }
export type PageDropdown = { readonly _tag: 'PageDropdown' }
export type PageMenu = { readonly _tag: 'PageMenu' }
export type PageMessage = { readonly _tag: 'PageMessage' }
export type PageModal = { readonly _tag: 'PageModal' }
export type PageNavbar = { readonly _tag: 'PageNavbar' }
export type PageFloatingSidebar = { readonly _tag: 'PageFloatingSidebar' }
export type PageSidebar = { readonly _tag: 'PageSidebar' }
export type PagePagination = { readonly _tag: 'PagePagination' }
export type PagePanel = { readonly _tag: 'PagePanel' }
export type PagePopover = { readonly _tag: 'PagePopover' }
export type PageTabs = { readonly _tag: 'PageTabs' }
export type PageField = { readonly _tag: 'PageField' }
export type PageInput = { readonly _tag: 'PageInput' }
export type PageTextarea = { readonly _tag: 'PageTextarea' }
export type PageSelect = { readonly _tag: 'PageSelect' }
export type PageCheckbox = { readonly _tag: 'PageCheckbox' }
export type PageRadio = { readonly _tag: 'PageRadio' }
export type PageFile = { readonly _tag: 'PageFile' }
export type PageContainer = { readonly _tag: 'PageContainer' }
export type PageHero = { readonly _tag: 'PageHero' }
export type PageSection = { readonly _tag: 'PageSection' }
export type PageLevel = { readonly _tag: 'PageLevel' }
export type PageMediaObject = { readonly _tag: 'PageMediaObject' }
export type PageFooter = { readonly _tag: 'PageFooter' }
export type PageColumns = { readonly _tag: 'PageColumns' }
export type PageDotLoading = { readonly _tag: 'PageDotLoading' }
export type PageNotFound = { readonly _tag: 'PageNotFound' }

export type AppPage =
  | PageHome
  | PageBlock
  | PageBox
  | PageButton
  | PageContent
  | PageDelete
  | PageIcon
  | PageImage
  | PageNotification
  | PageProgress
  | PageTable
  | PageTag
  | PageTitle
  | PageBreadcrumb
  | PageCard
  | PageDropdown
  | PageMenu
  | PageMessage
  | PageModal
  | PageNavbar
  | PageFloatingSidebar
  | PageSidebar
  | PagePagination
  | PagePanel
  | PagePopover
  | PageTabs
  | PageField
  | PageInput
  | PageTextarea
  | PageSelect
  | PageCheckbox
  | PageRadio
  | PageFile
  | PageContainer
  | PageHero
  | PageSection
  | PageLevel
  | PageMediaObject
  | PageFooter
  | PageColumns
  | PageDotLoading
  | PageNotFound

export type AppRoute = {
  page: AppPage
}

export const pageHome = (): PageHome => ({ _tag: 'PageHome' })
export const pageBlock = (): PageBlock => ({ _tag: 'PageBlock' })
export const pageBox = (): PageBox => ({ _tag: 'PageBox' })
export const pageButton = (): PageButton => ({ _tag: 'PageButton' })
export const pageContent = (): PageContent => ({ _tag: 'PageContent' })
export const pageDelete = (): PageDelete => ({ _tag: 'PageDelete' })
export const pageIcon = (): PageIcon => ({ _tag: 'PageIcon' })
export const pageImage = (): PageImage => ({ _tag: 'PageImage' })
export const pageNotification = (): PageNotification => ({
  _tag: 'PageNotification',
})
export const pageProgress = (): PageProgress => ({ _tag: 'PageProgress' })
export const pageTable = (): PageTable => ({ _tag: 'PageTable' })
export const pageTag = (): PageTag => ({ _tag: 'PageTag' })
export const pageTitle = (): PageTitle => ({ _tag: 'PageTitle' })
export const pageBreadcrumb = (): PageBreadcrumb => ({
  _tag: 'PageBreadcrumb',
})
export const pageCard = (): PageCard => ({ _tag: 'PageCard' })
export const pageDropdown = (): PageDropdown => ({ _tag: 'PageDropdown' })
export const pageMenu = (): PageMenu => ({ _tag: 'PageMenu' })
export const pageMessage = (): PageMessage => ({ _tag: 'PageMessage' })
export const pageModal = (): PageModal => ({ _tag: 'PageModal' })
export const pageNavbar = (): PageNavbar => ({ _tag: 'PageNavbar' })
export const pageFloatingSidebar = (): PageFloatingSidebar => ({
  _tag: 'PageFloatingSidebar',
})
export const pageSidebar = (): PageSidebar => ({ _tag: 'PageSidebar' })
export const pagePagination = (): PagePagination => ({
  _tag: 'PagePagination',
})
export const pagePanel = (): PagePanel => ({ _tag: 'PagePanel' })
export const pagePopover = (): PagePopover => ({ _tag: 'PagePopover' })
export const pageTabs = (): PageTabs => ({ _tag: 'PageTabs' })
export const pageField = (): PageField => ({ _tag: 'PageField' })
export const pageInput = (): PageInput => ({ _tag: 'PageInput' })
export const pageTextarea = (): PageTextarea => ({ _tag: 'PageTextarea' })
export const pageSelect = (): PageSelect => ({ _tag: 'PageSelect' })
export const pageCheckbox = (): PageCheckbox => ({ _tag: 'PageCheckbox' })
export const pageRadio = (): PageRadio => ({ _tag: 'PageRadio' })
export const pageFile = (): PageFile => ({ _tag: 'PageFile' })
export const pageContainer = (): PageContainer => ({ _tag: 'PageContainer' })
export const pageHero = (): PageHero => ({ _tag: 'PageHero' })
export const pageSection = (): PageSection => ({ _tag: 'PageSection' })
export const pageLevel = (): PageLevel => ({ _tag: 'PageLevel' })
export const pageMediaObject = (): PageMediaObject => ({
  _tag: 'PageMediaObject',
})
export const pageFooter = (): PageFooter => ({ _tag: 'PageFooter' })
export const pageColumns = (): PageColumns => ({ _tag: 'PageColumns' })
export const pageDotLoading = (): PageDotLoading => ({
  _tag: 'PageDotLoading',
})
export const pageNotFound = (): PageNotFound => ({ _tag: 'PageNotFound' })

export const AppPageEq: EqClass.Eq<AppPage> = {
  equals: (x, y) => x._tag === y._tag,
}

export const AppRouteEq: EqClass.Eq<AppRoute> = EqClass.struct({
  page: AppPageEq,
})
