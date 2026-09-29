import {
  Formatter,
  Match,
  Parser,
  Route,
  end,
  format,
  lit,
  parse,
  zero,
} from '@rinn7e/fp-ts-routing'
import * as O from 'fp-ts/lib/Option'

import {
  type AppPage,
  type AppRoute,
  pageBlock,
  pageBox,
  pageBreadcrumb,
  pageButton,
  pageCard,
  pageCheckbox,
  pageColumns,
  pageContainer,
  pageContent,
  pageDelete,
  pageDotLoading,
  pageDropdown,
  pageField,
  pageFile,
  pageFloatingSidebar,
  pageFooter,
  pageHero,
  pageHome,
  pageIcon,
  pageImage,
  pageInput,
  pageLevel,
  pageMediaObject,
  pageMenu,
  pageMessage,
  pageModal,
  pageNavbar,
  pageNotFound,
  pageNotification,
  pagePagination,
  pagePanel,
  pagePopover,
  pageProgress,
  pageRadio,
  pageSection,
  pageSelect,
  pageSidebar,
  pageTable,
  pageTabs,
  pageTag,
  pageTextarea,
  pageTitle,
} from './type'

export const removeBaseUrl = (href: string): string => {
  const url = new URL(href)
  const rawPathname = url.pathname
  const pathname =
    rawPathname !== '/' && rawPathname.endsWith('/')
      ? rawPathname.slice(0, -1)
      : rawPathname
  return pathname + url.search
}

export const addBaseUrl = (path: string): string => {
  const cleanPath = path.replace(/^\//, '')
  return '/' + cleanPath
}

const homeMatch = end
const blockMatch = lit('block').and(end)
const boxMatch = lit('box').and(end)
const buttonMatch = lit('button').and(end)
const contentMatch = lit('content').and(end)
const deleteMatch = lit('delete').and(end)
const iconMatch = lit('icon').and(end)
const imageMatch = lit('image').and(end)
const notificationMatch = lit('notification').and(end)
const progressMatch = lit('progress').and(end)
const tableMatch = lit('table').and(end)
const tagMatch = lit('tag').and(end)
const titleMatch = lit('title').and(end)
const breadcrumbMatch = lit('breadcrumb').and(end)
const cardMatch = lit('card').and(end)
const dropdownMatch = lit('dropdown').and(end)
const menuMatch = lit('menu').and(end)
const messageMatch = lit('message').and(end)
const modalMatch = lit('modal').and(end)
const navbarMatch = lit('navbar').and(end)
const floatingSidebarMatch = lit('floating-sidebar').and(end)
const sidebarMatch = lit('sidebar').and(end)
const paginationMatch = lit('pagination').and(end)
const panelMatch = lit('panel').and(end)
const popoverMatch = lit('popover').and(end)
const tabsMatch = lit('tabs').and(end)
const fieldMatch = lit('field').and(end)
const inputMatch = lit('input').and(end)
const textareaMatch = lit('textarea').and(end)
const selectMatch = lit('select').and(end)
const checkboxMatch = lit('checkbox').and(end)
const radioMatch = lit('radio').and(end)
const fileMatch = lit('file').and(end)
const containerMatch = lit('container').and(end)
const heroMatch = lit('hero').and(end)
const sectionMatch = lit('section').and(end)
const levelMatch = lit('level').and(end)
const mediaobjectMatch = lit('media-object').and(end)
const footerMatch = lit('footer').and(end)
const columnsMatch = lit('columns').and(end)
const dotloadingMatch = lit('dot-loading').and(end)

const anyStrings = new Match<object>(
  new Parser((r) => O.some([{}, new Route([], r.query)])),
  new Formatter((r) => r),
)

const appRouter: Parser<AppPage> = zero<AppPage>()
  .alt(homeMatch.parser.map(() => pageHome()))
  .alt(blockMatch.parser.map(() => pageBlock()))
  .alt(boxMatch.parser.map(() => pageBox()))
  .alt(buttonMatch.parser.map(() => pageButton()))
  .alt(contentMatch.parser.map(() => pageContent()))
  .alt(deleteMatch.parser.map(() => pageDelete()))
  .alt(iconMatch.parser.map(() => pageIcon()))
  .alt(imageMatch.parser.map(() => pageImage()))
  .alt(notificationMatch.parser.map(() => pageNotification()))
  .alt(progressMatch.parser.map(() => pageProgress()))
  .alt(tableMatch.parser.map(() => pageTable()))
  .alt(tagMatch.parser.map(() => pageTag()))
  .alt(titleMatch.parser.map(() => pageTitle()))
  .alt(breadcrumbMatch.parser.map(() => pageBreadcrumb()))
  .alt(cardMatch.parser.map(() => pageCard()))
  .alt(dropdownMatch.parser.map(() => pageDropdown()))
  .alt(menuMatch.parser.map(() => pageMenu()))
  .alt(messageMatch.parser.map(() => pageMessage()))
  .alt(modalMatch.parser.map(() => pageModal()))
  .alt(navbarMatch.parser.map(() => pageNavbar()))
  .alt(floatingSidebarMatch.parser.map(() => pageFloatingSidebar()))
  .alt(sidebarMatch.parser.map(() => pageSidebar()))
  .alt(paginationMatch.parser.map(() => pagePagination()))
  .alt(panelMatch.parser.map(() => pagePanel()))
  .alt(popoverMatch.parser.map(() => pagePopover()))
  .alt(tabsMatch.parser.map(() => pageTabs()))
  .alt(fieldMatch.parser.map(() => pageField()))
  .alt(inputMatch.parser.map(() => pageInput()))
  .alt(textareaMatch.parser.map(() => pageTextarea()))
  .alt(selectMatch.parser.map(() => pageSelect()))
  .alt(checkboxMatch.parser.map(() => pageCheckbox()))
  .alt(radioMatch.parser.map(() => pageRadio()))
  .alt(fileMatch.parser.map(() => pageFile()))
  .alt(containerMatch.parser.map(() => pageContainer()))
  .alt(heroMatch.parser.map(() => pageHero()))
  .alt(sectionMatch.parser.map(() => pageSection()))
  .alt(levelMatch.parser.map(() => pageLevel()))
  .alt(mediaobjectMatch.parser.map(() => pageMediaObject()))
  .alt(footerMatch.parser.map(() => pageFooter()))
  .alt(columnsMatch.parser.map(() => pageColumns()))
  .alt(dotloadingMatch.parser.map(() => pageDotLoading()))
  .alt(anyStrings.parser.map(() => pageNotFound()))

export const parsePath = (path: string): AppRoute => ({
  page: parse(appRouter, Route.parse(path), pageHome()),
})

export const parseAppRoute = (_mainUrl: string, href: string): AppRoute =>
  parsePath(removeBaseUrl(href))

export const toUrlString = (r: AppRoute): string => {
  const page = r.page
  const getPath = () => {
    switch (page._tag) {
      case 'PageHome':
        return format(homeMatch.formatter, {})
      case 'PageBlock':
        return format(blockMatch.formatter, {})
      case 'PageBox':
        return format(boxMatch.formatter, {})
      case 'PageButton':
        return format(buttonMatch.formatter, {})
      case 'PageContent':
        return format(contentMatch.formatter, {})
      case 'PageDelete':
        return format(deleteMatch.formatter, {})
      case 'PageIcon':
        return format(iconMatch.formatter, {})
      case 'PageImage':
        return format(imageMatch.formatter, {})
      case 'PageNotification':
        return format(notificationMatch.formatter, {})
      case 'PageProgress':
        return format(progressMatch.formatter, {})
      case 'PageTable':
        return format(tableMatch.formatter, {})
      case 'PageTag':
        return format(tagMatch.formatter, {})
      case 'PageTitle':
        return format(titleMatch.formatter, {})
      case 'PageBreadcrumb':
        return format(breadcrumbMatch.formatter, {})
      case 'PageCard':
        return format(cardMatch.formatter, {})
      case 'PageDropdown':
        return format(dropdownMatch.formatter, {})
      case 'PageMenu':
        return format(menuMatch.formatter, {})
      case 'PageMessage':
        return format(messageMatch.formatter, {})
      case 'PageModal':
        return format(modalMatch.formatter, {})
      case 'PageNavbar':
        return format(navbarMatch.formatter, {})
      case 'PageFloatingSidebar':
        return format(floatingSidebarMatch.formatter, {})
      case 'PageSidebar':
        return format(sidebarMatch.formatter, {})
      case 'PagePagination':
        return format(paginationMatch.formatter, {})
      case 'PagePanel':
        return format(panelMatch.formatter, {})
      case 'PagePopover':
        return format(popoverMatch.formatter, {})
      case 'PageTabs':
        return format(tabsMatch.formatter, {})
      case 'PageField':
        return format(fieldMatch.formatter, {})
      case 'PageInput':
        return format(inputMatch.formatter, {})
      case 'PageTextarea':
        return format(textareaMatch.formatter, {})
      case 'PageSelect':
        return format(selectMatch.formatter, {})
      case 'PageCheckbox':
        return format(checkboxMatch.formatter, {})
      case 'PageRadio':
        return format(radioMatch.formatter, {})
      case 'PageFile':
        return format(fileMatch.formatter, {})
      case 'PageContainer':
        return format(containerMatch.formatter, {})
      case 'PageHero':
        return format(heroMatch.formatter, {})
      case 'PageSection':
        return format(sectionMatch.formatter, {})
      case 'PageLevel':
        return format(levelMatch.formatter, {})
      case 'PageMediaObject':
        return format(mediaobjectMatch.formatter, {})
      case 'PageFooter':
        return format(footerMatch.formatter, {})
      case 'PageColumns':
        return format(columnsMatch.formatter, {})
      case 'PageDotLoading':
        return format(dotloadingMatch.formatter, {})
      case 'PageNotFound':
        return '404'
    }
  }

  const path = getPath()
  return addBaseUrl(path)
}
