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
  blockPage,
  boxPage,
  breadcrumbPage,
  buttonPage,
  cardPage,
  checkboxPage,
  columnsPage,
  containerPage,
  contentPage,
  deletePage,
  dotLoadingPage,
  dropdownPage,
  fieldPage,
  filePage,
  footerPage,
  heroPage,
  homePage,
  iconPage,
  imagePage,
  inputPage,
  levelPage,
  mediaObjectPage,
  menuPage,
  messagePage,
  modalPage,
  navbarPage,
  notFoundPage,
  notificationPage,
  paginationPage,
  panelPage,
  progressPage,
  radioPage,
  sectionPage,
  selectPage,
  tablePage,
  tabsPage,
  tagPage,
  textareaPage,
  titlePage,
} from './type'

export const removeBaseUrl = (href: string): string => {
  const url = new URL(href)
  let pathname = url.pathname
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1)
  }
  return (pathname || '/') + url.search
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
const paginationMatch = lit('pagination').and(end)
const panelMatch = lit('panel').and(end)
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
  .alt(homeMatch.parser.map(() => homePage()))
  .alt(blockMatch.parser.map(() => blockPage()))
  .alt(boxMatch.parser.map(() => boxPage()))
  .alt(buttonMatch.parser.map(() => buttonPage()))
  .alt(contentMatch.parser.map(() => contentPage()))
  .alt(deleteMatch.parser.map(() => deletePage()))
  .alt(iconMatch.parser.map(() => iconPage()))
  .alt(imageMatch.parser.map(() => imagePage()))
  .alt(notificationMatch.parser.map(() => notificationPage()))
  .alt(progressMatch.parser.map(() => progressPage()))
  .alt(tableMatch.parser.map(() => tablePage()))
  .alt(tagMatch.parser.map(() => tagPage()))
  .alt(titleMatch.parser.map(() => titlePage()))
  .alt(breadcrumbMatch.parser.map(() => breadcrumbPage()))
  .alt(cardMatch.parser.map(() => cardPage()))
  .alt(dropdownMatch.parser.map(() => dropdownPage()))
  .alt(menuMatch.parser.map(() => menuPage()))
  .alt(messageMatch.parser.map(() => messagePage()))
  .alt(modalMatch.parser.map(() => modalPage()))
  .alt(navbarMatch.parser.map(() => navbarPage()))
  .alt(paginationMatch.parser.map(() => paginationPage()))
  .alt(panelMatch.parser.map(() => panelPage()))
  .alt(tabsMatch.parser.map(() => tabsPage()))
  .alt(fieldMatch.parser.map(() => fieldPage()))
  .alt(inputMatch.parser.map(() => inputPage()))
  .alt(textareaMatch.parser.map(() => textareaPage()))
  .alt(selectMatch.parser.map(() => selectPage()))
  .alt(checkboxMatch.parser.map(() => checkboxPage()))
  .alt(radioMatch.parser.map(() => radioPage()))
  .alt(fileMatch.parser.map(() => filePage()))
  .alt(containerMatch.parser.map(() => containerPage()))
  .alt(heroMatch.parser.map(() => heroPage()))
  .alt(sectionMatch.parser.map(() => sectionPage()))
  .alt(levelMatch.parser.map(() => levelPage()))
  .alt(mediaobjectMatch.parser.map(() => mediaObjectPage()))
  .alt(footerMatch.parser.map(() => footerPage()))
  .alt(columnsMatch.parser.map(() => columnsPage()))
  .alt(dotloadingMatch.parser.map(() => dotLoadingPage()))
  .alt(anyStrings.parser.map(() => notFoundPage()))

export const parseAppRoute = (_mainUrl: string, href: string): AppRoute => {
  const pathname = removeBaseUrl(href)
  const page = parse(appRouter, Route.parse(pathname), homePage())
  return { page }
}

export const toUrlString = (r: AppRoute): string => {
  const page = r.page
  const getPath = () => {
    switch (page._tag) {
      case 'HomePage':
        return format(homeMatch.formatter, {})
      case 'BlockPage':
        return format(blockMatch.formatter, {})
      case 'BoxPage':
        return format(boxMatch.formatter, {})
      case 'ButtonPage':
        return format(buttonMatch.formatter, {})
      case 'ContentPage':
        return format(contentMatch.formatter, {})
      case 'DeletePage':
        return format(deleteMatch.formatter, {})
      case 'IconPage':
        return format(iconMatch.formatter, {})
      case 'ImagePage':
        return format(imageMatch.formatter, {})
      case 'NotificationPage':
        return format(notificationMatch.formatter, {})
      case 'ProgressPage':
        return format(progressMatch.formatter, {})
      case 'TablePage':
        return format(tableMatch.formatter, {})
      case 'TagPage':
        return format(tagMatch.formatter, {})
      case 'TitlePage':
        return format(titleMatch.formatter, {})
      case 'BreadcrumbPage':
        return format(breadcrumbMatch.formatter, {})
      case 'CardPage':
        return format(cardMatch.formatter, {})
      case 'DropdownPage':
        return format(dropdownMatch.formatter, {})
      case 'MenuPage':
        return format(menuMatch.formatter, {})
      case 'MessagePage':
        return format(messageMatch.formatter, {})
      case 'ModalPage':
        return format(modalMatch.formatter, {})
      case 'NavbarPage':
        return format(navbarMatch.formatter, {})
      case 'PaginationPage':
        return format(paginationMatch.formatter, {})
      case 'PanelPage':
        return format(panelMatch.formatter, {})
      case 'TabsPage':
        return format(tabsMatch.formatter, {})
      case 'FieldPage':
        return format(fieldMatch.formatter, {})
      case 'InputPage':
        return format(inputMatch.formatter, {})
      case 'TextareaPage':
        return format(textareaMatch.formatter, {})
      case 'SelectPage':
        return format(selectMatch.formatter, {})
      case 'CheckboxPage':
        return format(checkboxMatch.formatter, {})
      case 'RadioPage':
        return format(radioMatch.formatter, {})
      case 'FilePage':
        return format(fileMatch.formatter, {})
      case 'ContainerPage':
        return format(containerMatch.formatter, {})
      case 'HeroPage':
        return format(heroMatch.formatter, {})
      case 'SectionPage':
        return format(sectionMatch.formatter, {})
      case 'LevelPage':
        return format(levelMatch.formatter, {})
      case 'MediaObjectPage':
        return format(mediaobjectMatch.formatter, {})
      case 'FooterPage':
        return format(footerMatch.formatter, {})
      case 'ColumnsPage':
        return format(columnsMatch.formatter, {})
      case 'DotLoadingPage':
        return format(dotloadingMatch.formatter, {})
      case 'NotFoundPage':
        return '404'
    }
  }

  const path = getPath()
  return addBaseUrl(path)
}
