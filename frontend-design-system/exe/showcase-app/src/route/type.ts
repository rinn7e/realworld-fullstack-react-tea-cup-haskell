import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'

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
]

export type HomePage = {
  readonly _tag: 'HomePage'
}

export type ComponentPage = {
  readonly _tag: 'ComponentPage'
  component: ComponentItem
}

export type NotFoundPage = {
  readonly _tag: 'NotFoundPage'
}

export type AppPage = HomePage | ComponentPage | NotFoundPage

export type AppRoute = {
  page: AppPage
}

export const homePage = (): HomePage => ({ _tag: 'HomePage' })
export const componentPage = (component: ComponentItem): ComponentPage => ({
  _tag: 'ComponentPage',
  component,
})
export const notFoundPage = (): NotFoundPage => ({ _tag: 'NotFoundPage' })

export const AppPageEq: EqClass.Eq<AppPage> = {
  equals: (x, y) => {
    if (x._tag !== y._tag) return false
    if (x._tag === 'ComponentPage' && y._tag === 'ComponentPage') {
      return S.Eq.equals(x.component, y.component)
    }
    return true
  },
}

export const AppRouteEq: EqClass.Eq<AppRoute> = EqClass.struct({
  page: AppPageEq,
})
