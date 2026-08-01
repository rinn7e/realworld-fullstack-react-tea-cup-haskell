import React from 'react'
import {
  Box,
  Column,
  Columns,
  Container,
  Footer,
  Input,
  Menu,
  Navbar,
} from '@rinn7e/realworld-design-system'
import { BookOpen, Layers, LayoutGrid, Search, Sparkles } from 'lucide-react'

import { ButtonPage } from './page/button/component'
import { ComponentViewPage } from './page/component/component'
import { HomePage } from './page/home/component'
import { NotFoundPage } from './page/not-found/component'
import type { AppRoute, ComponentItem } from './route/type'
import type { Model, Msg, SectionCategory } from './type'

export const view = (
  dispatch: (msg: Msg) => void,
  model: Model,
): React.ReactElement => {
  const categories: {
    id: SectionCategory
    title: string
    icon: React.ReactNode
    items: { id: ComponentItem; name: string }[]
  }[] = [
    {
      id: 'elements',
      title: 'Elements',
      icon: <Layers className='h-4 w-4 text-green-600' />,
      items: [
        { id: 'block', name: 'Block' },
        { id: 'box', name: 'Box' },
        { id: 'button', name: 'Button' },
        { id: 'content', name: 'Content' },
        { id: 'delete', name: 'Delete' },
        { id: 'icon', name: 'Icon' },
        { id: 'image', name: 'Image' },
        { id: 'notification', name: 'Notification' },
        { id: 'progress', name: 'Progress' },
        { id: 'table', name: 'Table' },
        { id: 'tag', name: 'Tag' },
        { id: 'title', name: 'Title' },
      ],
    },
    {
      id: 'components',
      title: 'Components',
      icon: <Sparkles className='h-4 w-4 text-green-600' />,
      items: [
        { id: 'breadcrumb', name: 'Breadcrumb' },
        { id: 'card', name: 'Card' },
        { id: 'dropdown', name: 'Dropdown' },
        { id: 'menu', name: 'Menu' },
        { id: 'message', name: 'Message' },
        { id: 'modal', name: 'Modal' },
        { id: 'navbar', name: 'Navbar' },
        { id: 'pagination', name: 'Pagination' },
        { id: 'panel', name: 'Panel' },
        { id: 'tabs', name: 'Tabs' },
      ],
    },
    {
      id: 'form',
      title: 'Form',
      icon: <BookOpen className='h-4 w-4 text-green-600' />,
      items: [
        { id: 'field', name: 'Field' },
        { id: 'input', name: 'Input' },
        { id: 'textarea', name: 'Textarea' },
        { id: 'select', name: 'Select' },
        { id: 'checkbox', name: 'Checkbox' },
        { id: 'radio', name: 'Radio' },
        { id: 'file', name: 'File' },
      ],
    },
    {
      id: 'layout',
      title: 'Layout',
      icon: <LayoutGrid className='h-4 w-4 text-green-600' />,
      items: [
        { id: 'container', name: 'Container' },
        { id: 'hero', name: 'Hero' },
        { id: 'section', name: 'Section' },
        { id: 'level', name: 'Level' },
        { id: 'media-object', name: 'Media Object' },
        { id: 'footer', name: 'Footer' },
      ],
    },
    {
      id: 'grid',
      title: 'Grid',
      icon: <LayoutGrid className='h-4 w-4 text-green-600' />,
      items: [{ id: 'columns', name: 'Columns' }],
    },
  ]

  const activeComponent =
    model.route.page._tag === 'ComponentPage' ? model.route.page.component : ''

  const menuCategories: Menu.MenuCategory[] = categories.map((cat) => ({
    title: cat.title,
    items: cat.items.map((item) => ({
      id: item.id,
      label: item.name,
      isActive: activeComponent === item.id,
    })),
  }))

  const navigateRoute = (route: AppRoute) => {
    dispatch({ _tag: 'ChangeRoute', route })
  }

  const renderPage = () => {
    switch (model.pageModel._tag) {
      case 'HomePageModel':
        return (
          <HomePage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'HomePageMsg', subMsg })}
            navigateRoute={navigateRoute}
          />
        )
      case 'ButtonPageModel':
        return (
          <ButtonPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'ButtonPageMsg', subMsg })}
          />
        )
      case 'ComponentPageModel':
        return (
          <ComponentViewPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'ComponentPageMsg', subMsg })}
          />
        )
      case 'NotFoundPageModel':
      default:
        return <NotFoundPage navigateRoute={navigateRoute} />
    }
  }

  return (
    <div className='flex min-h-screen flex-col bg-white font-sans text-gray-900'>
      {/* Top Navbar Header */}
      {Navbar.view({
        brand: (
          <button
            onClick={() => navigateRoute({ page: { _tag: 'HomePage' } })}
            className='font-titillium text-2xl font-bold tracking-tight text-green-600 hover:opacity-90'
          >
            conduit
          </button>
        ),
        startItems: [
          {
            id: 'design-system',
            label: (
              <button
                onClick={() => navigateRoute({ page: { _tag: 'HomePage' } })}
                className='font-semibold text-gray-700 hover:text-green-600'
              >
                Design System Showcase
              </button>
            ),
          },
        ],
        endItems: [
          {
            id: 'search',
            label: (
              <div className='relative flex items-center'>
                <Search className='absolute left-3 h-4 w-4 text-gray-400' />
                {Input.view({
                  value: model.searchQuery,
                  placeholder: 'Search components…',
                  size: 'small',
                  isRounded: true,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch({ _tag: 'UpdateSearch', query: e.target.value }),
                  className: 'w-52 pl-9',
                })}
              </div>
            ),
          },
        ],
        model: model.navbarModel,
        dispatch: (subMsg: Navbar.Msg) =>
          dispatch({ _tag: 'NavbarMsg', subMsg }),
      })}

      {/* Main Layout Container */}
      {Container.view({
        className: 'my-8 flex-1 w-full',
        children: Columns.view({
          children: (
            <>
              {/* Left Sidebar Navigation */}
              {Column.view({
                size: 'one-quarter',
                children: Box.view({
                  className: 'p-4 w-full text-left',
                  children: Menu.view({
                    categories: menuCategories,
                    model: model.menuModel,
                    dispatch: (subMsg: Menu.Msg) => {
                      if (subMsg._tag === 'Select') {
                        const compId = subMsg.id as ComponentItem
                        navigateRoute({
                          page: { _tag: 'ComponentPage', component: compId },
                        })
                      }
                    },
                  }),
                }),
              })}

              {/* Main Page Area */}
              {Column.view({
                size: 'three-quarters',
                children: <div className='w-full'>{renderPage()}</div>,
              })}
            </>
          ),
        }),
      })}

      {/* Footer */}
      {Footer.view({})}
    </div>
  )
}
