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
  type Destination,
  type Screen,
  blockScreen,
  boxScreen,
  breadcrumbScreen,
  buttonScreen,
  cardScreen,
  checkboxScreen,
  columnsScreen,
  containerScreen,
  contentScreen,
  deleteScreen,
  dotLoadingScreen,
  dropdownScreen,
  fieldScreen,
  fileScreen,
  floatingSidebarScreen,
  footerScreen,
  heroScreen,
  homeScreen,
  iconScreen,
  imageScreen,
  inputScreen,
  levelScreen,
  mediaObjectScreen,
  menuScreen,
  messageScreen,
  modalScreen,
  navbarScreen,
  notFoundScreen,
  notificationScreen,
  paginationScreen,
  panelScreen,
  popoverScreen,
  progressScreen,
  radioScreen,
  sectionScreen,
  selectScreen,
  sidebarScreen,
  tableScreen,
  tabsScreen,
  tagScreen,
  textareaScreen,
  titleScreen,
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

// The only code that knows how a destination is spelled in the URL

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

const screenParser: Parser<Screen> = zero<Screen>()
  .alt(homeMatch.parser.map(() => homeScreen()))
  .alt(blockMatch.parser.map(() => blockScreen()))
  .alt(boxMatch.parser.map(() => boxScreen()))
  .alt(buttonMatch.parser.map(() => buttonScreen()))
  .alt(contentMatch.parser.map(() => contentScreen()))
  .alt(deleteMatch.parser.map(() => deleteScreen()))
  .alt(iconMatch.parser.map(() => iconScreen()))
  .alt(imageMatch.parser.map(() => imageScreen()))
  .alt(notificationMatch.parser.map(() => notificationScreen()))
  .alt(progressMatch.parser.map(() => progressScreen()))
  .alt(tableMatch.parser.map(() => tableScreen()))
  .alt(tagMatch.parser.map(() => tagScreen()))
  .alt(titleMatch.parser.map(() => titleScreen()))
  .alt(breadcrumbMatch.parser.map(() => breadcrumbScreen()))
  .alt(cardMatch.parser.map(() => cardScreen()))
  .alt(dropdownMatch.parser.map(() => dropdownScreen()))
  .alt(menuMatch.parser.map(() => menuScreen()))
  .alt(messageMatch.parser.map(() => messageScreen()))
  .alt(modalMatch.parser.map(() => modalScreen()))
  .alt(navbarMatch.parser.map(() => navbarScreen()))
  .alt(floatingSidebarMatch.parser.map(() => floatingSidebarScreen()))
  .alt(sidebarMatch.parser.map(() => sidebarScreen()))
  .alt(paginationMatch.parser.map(() => paginationScreen()))
  .alt(panelMatch.parser.map(() => panelScreen()))
  .alt(popoverMatch.parser.map(() => popoverScreen()))
  .alt(tabsMatch.parser.map(() => tabsScreen()))
  .alt(fieldMatch.parser.map(() => fieldScreen()))
  .alt(inputMatch.parser.map(() => inputScreen()))
  .alt(textareaMatch.parser.map(() => textareaScreen()))
  .alt(selectMatch.parser.map(() => selectScreen()))
  .alt(checkboxMatch.parser.map(() => checkboxScreen()))
  .alt(radioMatch.parser.map(() => radioScreen()))
  .alt(fileMatch.parser.map(() => fileScreen()))
  .alt(containerMatch.parser.map(() => containerScreen()))
  .alt(heroMatch.parser.map(() => heroScreen()))
  .alt(sectionMatch.parser.map(() => sectionScreen()))
  .alt(levelMatch.parser.map(() => levelScreen()))
  .alt(mediaobjectMatch.parser.map(() => mediaObjectScreen()))
  .alt(footerMatch.parser.map(() => footerScreen()))
  .alt(columnsMatch.parser.map(() => columnsScreen()))
  .alt(dotloadingMatch.parser.map(() => dotLoadingScreen()))
  .alt(anyStrings.parser.map(() => notFoundScreen()))

// `href`: a full URL (the page's `location.href`)
export const parseDestination = (href: string): Destination => ({
  screen: parse(screenParser, Route.parse(removeBaseUrl(href)), homeScreen()),
})

export const toUrlString = (destination: Destination): string => {
  const { screen } = destination
  const getPath = () => {
    switch (screen._tag) {
      case 'HomeScreen':
        return format(homeMatch.formatter, {})
      case 'BlockScreen':
        return format(blockMatch.formatter, {})
      case 'BoxScreen':
        return format(boxMatch.formatter, {})
      case 'ButtonScreen':
        return format(buttonMatch.formatter, {})
      case 'ContentScreen':
        return format(contentMatch.formatter, {})
      case 'DeleteScreen':
        return format(deleteMatch.formatter, {})
      case 'IconScreen':
        return format(iconMatch.formatter, {})
      case 'ImageScreen':
        return format(imageMatch.formatter, {})
      case 'NotificationScreen':
        return format(notificationMatch.formatter, {})
      case 'ProgressScreen':
        return format(progressMatch.formatter, {})
      case 'TableScreen':
        return format(tableMatch.formatter, {})
      case 'TagScreen':
        return format(tagMatch.formatter, {})
      case 'TitleScreen':
        return format(titleMatch.formatter, {})
      case 'BreadcrumbScreen':
        return format(breadcrumbMatch.formatter, {})
      case 'CardScreen':
        return format(cardMatch.formatter, {})
      case 'DropdownScreen':
        return format(dropdownMatch.formatter, {})
      case 'MenuScreen':
        return format(menuMatch.formatter, {})
      case 'MessageScreen':
        return format(messageMatch.formatter, {})
      case 'ModalScreen':
        return format(modalMatch.formatter, {})
      case 'NavbarScreen':
        return format(navbarMatch.formatter, {})
      case 'FloatingSidebarScreen':
        return format(floatingSidebarMatch.formatter, {})
      case 'SidebarScreen':
        return format(sidebarMatch.formatter, {})
      case 'PaginationScreen':
        return format(paginationMatch.formatter, {})
      case 'PanelScreen':
        return format(panelMatch.formatter, {})
      case 'PopoverScreen':
        return format(popoverMatch.formatter, {})
      case 'TabsScreen':
        return format(tabsMatch.formatter, {})
      case 'FieldScreen':
        return format(fieldMatch.formatter, {})
      case 'InputScreen':
        return format(inputMatch.formatter, {})
      case 'TextareaScreen':
        return format(textareaMatch.formatter, {})
      case 'SelectScreen':
        return format(selectMatch.formatter, {})
      case 'CheckboxScreen':
        return format(checkboxMatch.formatter, {})
      case 'RadioScreen':
        return format(radioMatch.formatter, {})
      case 'FileScreen':
        return format(fileMatch.formatter, {})
      case 'ContainerScreen':
        return format(containerMatch.formatter, {})
      case 'HeroScreen':
        return format(heroMatch.formatter, {})
      case 'SectionScreen':
        return format(sectionMatch.formatter, {})
      case 'LevelScreen':
        return format(levelMatch.formatter, {})
      case 'MediaObjectScreen':
        return format(mediaobjectMatch.formatter, {})
      case 'FooterScreen':
        return format(footerMatch.formatter, {})
      case 'ColumnsScreen':
        return format(columnsMatch.formatter, {})
      case 'DotLoadingScreen':
        return format(dotloadingMatch.formatter, {})
      case 'NotFoundScreen':
        return '404'
    }
  }

  const path = getPath()
  return addBaseUrl(path)
}
