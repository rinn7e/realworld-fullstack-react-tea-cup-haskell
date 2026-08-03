import { NavbarMemo as DsNavbarMemo } from '@rinn7e/realworld-design-system/component/navbar/component'
import { SidebarMemo as DsSidebarMemo } from '@rinn7e/realworld-design-system/component/sidebar/component'
import { ColumnMemo as DsColumnMemo } from '@rinn7e/realworld-design-system/grid/column/component'
import { ColumnsMemo as DsColumnsMemo } from '@rinn7e/realworld-design-system/grid/columns/component'
import { ContainerMemo as DsContainerMemo } from '@rinn7e/realworld-design-system/layout/container/component'
import { FooterMemo as DsFooterMemo } from '@rinn7e/realworld-design-system/layout/footer/component'

import {
  SHOWCASE_CATEGORIES,
  getRightSidebarCategories,
  getSidebarCategories,
} from './constant/menu'
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
import { FloatingSidebarPage } from './page/floating-sidebar/component'
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
import { SidebarPage } from './page/sidebar/component'
import { TablePage } from './page/table/component'
import { TabsPage } from './page/tabs/component'
import { TagPage } from './page/tag/component'
import { TextareaPage } from './page/textarea/component'
import { TitlePage } from './page/title/component'
import type { AppRoute } from './route/type'
import type { Model, Msg } from './type'

export const view = (
  dispatch: (msg: Msg) => void,
  model: Model,
): React.ReactElement => {
  const activeComponent =
    model.route.page._tag === 'HomePage' ||
    model.route.page._tag === 'NotFoundPage'
      ? ''
      : model.route.page._tag.replace(/Page$/, '').toLowerCase()

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
      case 'FloatingSidebarPageModel':
        return (
          <FloatingSidebarPage
            model={model.pageModel.model}
            dispatch={(subMsg) =>
              dispatch({ _tag: 'FloatingSidebarPageMsg', subMsg })
            }
          />
        )
      case 'SidebarPageModel':
        return (
          <SidebarPage
            model={model.pageModel.model}
            dispatch={(subMsg) => dispatch({ _tag: 'SidebarPageMsg', subMsg })}
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
      <DsNavbarMemo
        config={{
          brandNavItem: {
            key: 'brand',
            label: 'RealWorld Design System',
            href: '#/',
            isActive: false,
          },
          desktopNavItems: [
            {
              key: 'home',
              label: 'Home',
              href: '#/',
              isActive: model.route.page._tag === 'HomePage',
            },
            {
              key: 'elements',
              label: 'Elements',
              href: '#/block',
              isActive:
                model.route.page._tag !== 'HomePage' &&
                SHOWCASE_CATEGORIES[0].items.some(
                  (i) => i.id === activeComponent,
                ),
            },
            {
              key: 'components',
              label: 'Components',
              href: '#/breadcrumb',
              isActive:
                model.route.page._tag !== 'HomePage' &&
                SHOWCASE_CATEGORIES[1].items.some(
                  (i) => i.id === activeComponent,
                ),
            },
            {
              key: 'form',
              label: 'Form',
              href: '#/field',
              isActive:
                model.route.page._tag !== 'HomePage' &&
                SHOWCASE_CATEGORIES[2].items.some(
                  (i) => i.id === activeComponent,
                ),
            },
          ],
          mobileNavItems: [],
        }}
        dispatch={(subMsg) => dispatch({ _tag: 'TopNavbarMsg', subMsg })}
      />

      {/* Main Layout Container */}
      <DsContainerMemo className='my-8 w-full max-w-none flex-1 xl:w-[70%]'>
        {() => (
          <DsColumnsMemo>
            {() => (
              <>
                {/* Left Sidebar Navigation */}
                <DsColumnMemo className='w-full md:w-auto md:shrink-0 md:grow-0'>
                  {() => (
                    <DsSidebarMemo
                      model={model.sidebarModel}
                      categories={getSidebarCategories(activeComponent)}
                      brandTitle='Showcase'
                      dispatch={(subMsg) =>
                        dispatch({ _tag: 'SidebarMsg', subMsg })
                      }
                      className='rounded-lg border border-gray-200/80 bg-white shadow-sm'
                    />
                  )}
                </DsColumnMemo>

                {/* Main Page Area */}
                <DsColumnMemo className='min-w-0 flex-1'>
                  {() => <div className='w-full'>{renderPage()}</div>}
                </DsColumnMemo>

                {/* Right Sidebar Navigation */}
                <DsColumnMemo className='w-full md:w-auto md:shrink-0 md:grow-0'>
                  {() => (
                    <DsSidebarMemo
                      model={model.rightSidebarModel}
                      categories={getRightSidebarCategories()}
                      brandTitle='Setting'
                      align='right'
                      dispatch={(subMsg) =>
                        dispatch({ _tag: 'RightSidebarMsg', subMsg })
                      }
                      className='rounded-lg border border-gray-200/80 bg-white shadow-sm'
                    />
                  )}
                </DsColumnMemo>
              </>
            )}
          </DsColumnsMemo>
        )}
      </DsContainerMemo>

      {/* Footer */}
      <DsFooterMemo />
    </div>
  )
}
