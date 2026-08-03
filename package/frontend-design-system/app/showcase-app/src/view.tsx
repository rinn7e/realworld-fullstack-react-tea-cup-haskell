import * as Menu from '@rinn7e/realworld-design-system/component/menu'
import { NavbarMemo } from '@rinn7e/realworld-design-system/component/navbar/component'
import { ColumnMemo } from '@rinn7e/realworld-design-system/grid/column/component'
import { ColumnsMemo } from '@rinn7e/realworld-design-system/grid/columns/component'
import { ContainerMemo } from '@rinn7e/realworld-design-system/layout/container/component'
import { FooterMemo } from '@rinn7e/realworld-design-system/layout/footer/component'
import { BookOpen, Layers, LayoutGrid, Sparkles } from 'lucide-react'
import React from 'react'

import { Sidebar } from './component/sidebar'
import { BlockPage } from './page/block/component'
import { BoxPage } from './page/box/component'
import { BreadcrumbPage } from './page/breadcrumb/component'
import { ButtonPage } from './page/button/component'
import { CardPage } from './page/card/component'
import { CheckboxPage } from './page/checkbox/component'
import { ColumnsPage } from './page/columns/component'
import { ContainerPage } from './page/container/component'
import { ContentPage } from './page/content/component'
import { DeletePage } from './page/delete/component'
import { DotLoadingPage } from './page/dot-loading/component'
import { DropdownPage } from './page/dropdown/component'
import { FieldPage } from './page/field/component'
import { FilePage } from './page/file/component'
import { FooterPage } from './page/footer/component'
import { HeroPage } from './page/hero/component'
import { HomePage } from './page/home/component'
import { IconPage } from './page/icon/component'
import { ImagePage } from './page/image/component'
import { InputPage } from './page/input/component'
import { LevelPage } from './page/level/component'
import { MediaObjectPage } from './page/media-object/component'
import { MenuPage } from './page/menu/component'
import { MessagePage } from './page/message/component'
import { ModalPage } from './page/modal/component'
import { NavbarPage } from './page/navbar/component'
import { NotFoundPage } from './page/not-found/component'
import { NotificationPage } from './page/notification/component'
import { PaginationPage } from './page/pagination/component'
import { PanelPage } from './page/panel/component'
import { ProgressPage } from './page/progress/component'
import { RadioPage } from './page/radio/component'
import { SectionPage } from './page/section/component'
import { SelectPage } from './page/select/component'
import { TablePage } from './page/table/component'
import { TabsPage } from './page/tabs/component'
import { TagPage } from './page/tag/component'
import { TextareaPage } from './page/textarea/component'
import { TitlePage } from './page/title/component'
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
      ] },
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
      ] },
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
      ] },
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
      ] },
    {
      id: 'grid',
      title: 'Grid',
      icon: <LayoutGrid className='h-4 w-4 text-green-600' />,
      items: [{ id: 'columns', name: 'Columns' }] },
    {
      id: 'misc',
      title: 'Misc',
      icon: <Sparkles className='h-4 w-4 text-green-600' />,
      items: [{ id: 'dot-loading', name: 'Dot Loading' }] },
  ]

  const activeComponent =
    model.route.page._tag === 'HomePage' ||
    model.route.page._tag === 'NotFoundPage'
      ? ''
      : model.route.page._tag.replace(/Page$/, '').toLowerCase()

  const menuCategories: Menu.MenuCategory[] = categories.map((cat) => ({
    title: cat.title,
    items: cat.items.map((item) => ({
      id: item.id,
      label: item.name,
      isActive: activeComponent === item.id })) }))

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
      case 'BlockPageModel':
        return (
          <BlockPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'BlockPageMsg', subMsg })}
          />
        )
      case 'BoxPageModel':
        return (
          <BoxPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'BoxPageMsg', subMsg })}
          />
        )
      case 'BreadcrumbPageModel':
        return (
          <BreadcrumbPage
            model={model.pageModel.model}
            dispatch={(subMsg) =>
              dispatch({ _tag: 'BreadcrumbPageMsg', subMsg })
            }
          />
        )
      case 'ButtonPageModel':
        return (
          <ButtonPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'ButtonPageMsg', subMsg })}
          />
        )
      case 'CardPageModel':
        return (
          <CardPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'CardPageMsg', subMsg })}
          />
        )
      case 'CheckboxPageModel':
        return (
          <CheckboxPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'CheckboxPageMsg', subMsg })}
          />
        )
      case 'ColumnsPageModel':
        return (
          <ColumnsPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'ColumnsPageMsg', subMsg })}
          />
        )
      case 'ContainerPageModel':
        return (
          <ContainerPage
            model={model.pageModel.model}
            dispatch={(subMsg) =>
              dispatch({ _tag: 'ContainerPageMsg', subMsg })
            }
          />
        )
      case 'ContentPageModel':
        return (
          <ContentPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'ContentPageMsg', subMsg })}
          />
        )
      case 'DotLoadingPageModel':
        return (
          <DotLoadingPage
            model={model.pageModel.model}
            dispatch={(subMsg) =>
              dispatch({ _tag: 'DotLoadingPageMsg', subMsg })
            }
          />
        )
      case 'DeletePageModel':
        return (
          <DeletePage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'DeletePageMsg', subMsg })}
          />
        )
      case 'DropdownPageModel':
        return (
          <DropdownPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'DropdownPageMsg', subMsg })}
          />
        )
      case 'FieldPageModel':
        return (
          <FieldPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'FieldPageMsg', subMsg })}
          />
        )
      case 'FilePageModel':
        return (
          <FilePage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'FilePageMsg', subMsg })}
          />
        )
      case 'FooterPageModel':
        return (
          <FooterPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'FooterPageMsg', subMsg })}
          />
        )
      case 'HeroPageModel':
        return (
          <HeroPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'HeroPageMsg', subMsg })}
          />
        )
      case 'IconPageModel':
        return (
          <IconPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'IconPageMsg', subMsg })}
          />
        )
      case 'ImagePageModel':
        return (
          <ImagePage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'ImagePageMsg', subMsg })}
          />
        )
      case 'InputPageModel':
        return (
          <InputPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'InputPageMsg', subMsg })}
          />
        )
      case 'LevelPageModel':
        return (
          <LevelPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'LevelPageMsg', subMsg })}
          />
        )
      case 'MediaObjectPageModel':
        return (
          <MediaObjectPage
            model={model.pageModel.model}
            dispatch={(subMsg) =>
              dispatch({ _tag: 'MediaObjectPageMsg', subMsg })
            }
          />
        )
      case 'MenuPageModel':
        return (
          <MenuPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'MenuPageMsg', subMsg })}
          />
        )
      case 'MessagePageModel':
        return (
          <MessagePage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'MessagePageMsg', subMsg })}
          />
        )
      case 'ModalPageModel':
        return (
          <ModalPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'ModalPageMsg', subMsg })}
          />
        )
      case 'NavbarPageModel':
        return (
          <NavbarPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'NavbarPageMsg', subMsg })}
          />
        )
      case 'NotificationPageModel':
        return (
          <NotificationPage
            model={model.pageModel.model}
            dispatch={(subMsg) =>
              dispatch({ _tag: 'NotificationPageMsg', subMsg })
            }
          />
        )
      case 'PaginationPageModel':
        return (
          <PaginationPage
            model={model.pageModel.model}
            dispatch={(subMsg) =>
              dispatch({ _tag: 'PaginationPageMsg', subMsg })
            }
          />
        )
      case 'PanelPageModel':
        return (
          <PanelPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'PanelPageMsg', subMsg })}
          />
        )
      case 'ProgressPageModel':
        return (
          <ProgressPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'ProgressPageMsg', subMsg })}
          />
        )
      case 'RadioPageModel':
        return (
          <RadioPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'RadioPageMsg', subMsg })}
          />
        )
      case 'SectionPageModel':
        return (
          <SectionPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'SectionPageMsg', subMsg })}
          />
        )
      case 'SelectPageModel':
        return (
          <SelectPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'SelectPageMsg', subMsg })}
          />
        )
      case 'TablePageModel':
        return (
          <TablePage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'TablePageMsg', subMsg })}
          />
        )
      case 'TabsPageModel':
        return (
          <TabsPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'TabsPageMsg', subMsg })}
          />
        )
      case 'TagPageModel':
        return (
          <TagPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'TagPageMsg', subMsg })}
          />
        )
      case 'TextareaPageModel':
        return (
          <TextareaPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'TextareaPageMsg', subMsg })}
          />
        )
      case 'TitlePageModel':
        return (
          <TitlePage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'TitlePageMsg', subMsg })}
          />
        )
      case 'NotFoundPageModel':
      default:
        return <NotFoundPage navigateRoute={navigateRoute} />
    }
  }

  return (
    <div
      data-component='ShowcaseApp'
      className='flex min-h-screen flex-col bg-white font-sans text-gray-900'
    >
      {/* Top Navbar Header */}
      <NavbarMemo
        config={{ desktopNavItems: [], mobileNavItems: [] }}
        dispatch={() => {}}
      />

      {/* Main Layout Container */}
      <ContainerMemo className='my-8 flex-1 w-full'>
        {() => (
          <ColumnsMemo>
            {() => (
              <>
                {/* Left Sidebar Navigation */}
                <ColumnMemo className='w-full md:w-56 md:shrink-0 md:grow-0'>
                  {() => (
                    <Sidebar
                      menuCategories={menuCategories}
                      menuModel={model.menuModel}
                      navigateRoute={navigateRoute}
                    />
                  )}
                </ColumnMemo>

                {/* Main Page Area */}
                <ColumnMemo className='flex-1 min-w-0'>
                  {() => <div className='w-full'>{renderPage()}</div>}
                </ColumnMemo>
              </>
            )}
          </ColumnsMemo>
        )}
      </ContainerMemo>

      {/* Footer */}
      <FooterMemo />
    </div>
  )
}
