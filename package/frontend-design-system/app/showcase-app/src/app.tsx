import { NavbarMemo as DsNavbarMemo } from '@rinn7e/realworld-design-system/component/navbar/component'
import { SidebarMemo as DsSidebarMemo } from '@rinn7e/realworld-design-system/component/sidebar/component'
import { ColumnMemo as DsColumnMemo } from '@rinn7e/realworld-design-system/grid/column/component'
import { ColumnsMemo as DsColumnsMemo } from '@rinn7e/realworld-design-system/grid/columns/component'
import { ContainerMemo as DsContainerMemo } from '@rinn7e/realworld-design-system/layout/container/component'
import { FooterMemo as DsFooterMemo } from '@rinn7e/realworld-design-system/layout/footer/component'
import * as TeaRouter from '@rinn7e/tea-cup-router'
import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import { Monitor, Moon, Sun } from 'lucide-react'
import { memo } from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import {
  SHOWCASE_CATEGORIES,
  getRightSidebarCategories,
  getSidebarCategories,
} from '@/common/constant/menu'
import type { AppRoute } from '@/common/type/route'
import { BlockPageMemo } from '@/page/block/component'
import { BoxPageMemo } from '@/page/box/component'
import { BreadcrumbPageMemo } from '@/page/breadcrumb/component'
import { ButtonPageMemo } from '@/page/button/component'
import { CardPageMemo } from '@/page/card/component'
import { CheckboxPageMemo } from '@/page/checkbox/component'
import { ColumnsPageMemo } from '@/page/columns/component'
import { ContainerPageMemo } from '@/page/container/component'
import { ContentPageMemo } from '@/page/content/component'
import { DeletePageMemo } from '@/page/delete/component'
import { DotLoadingPageMemo } from '@/page/dot-loading/component'
import { DropdownPageMemo } from '@/page/dropdown/component'
import { FieldPageMemo } from '@/page/field/component'
import { FilePageMemo } from '@/page/file/component'
import { FloatingSidebarPageMemo } from '@/page/floating-sidebar/component'
import { FooterPageMemo } from '@/page/footer/component'
import { HeroPageMemo } from '@/page/hero/component'
import { HomePageMemo } from '@/page/home/component'
import { IconPageMemo } from '@/page/icon/component'
import { ImagePageMemo } from '@/page/image/component'
import { InputPageMemo } from '@/page/input/component'
import { LevelPageMemo } from '@/page/level/component'
import { MediaObjectPageMemo } from '@/page/media-object/component'
import { MenuPageMemo } from '@/page/menu/component'
import { MessagePageMemo } from '@/page/message/component'
import { ModalPageMemo } from '@/page/modal/component'
import { NavbarPageMemo } from '@/page/navbar/component'
import { NotFoundPageMemo } from '@/page/not-found/component'
import { NotificationPageMemo } from '@/page/notification/component'
import { PaginationPageMemo } from '@/page/pagination/component'
import { PanelPageMemo } from '@/page/panel/component'
import { PopoverPageMemo } from '@/page/popover/component'
import { ProgressPageMemo } from '@/page/progress/component'
import { RadioPageMemo } from '@/page/radio/component'
import { SectionPageMemo } from '@/page/section/component'
import { SelectPageMemo } from '@/page/select/component'
import { SidebarPageMemo } from '@/page/sidebar/component'
import { TablePageMemo } from '@/page/table/component'
import { TabsPageMemo } from '@/page/tabs/component'
import { TagPageMemo } from '@/page/tag/component'
import { TextareaPageMemo } from '@/page/textarea/component'
import { TitlePageMemo } from '@/page/title/component'
import type { ColorScheme } from '@/theme/type'

import { type Model, type Msg, type PageModel, teaRouterMsg } from './type'

type ColorSchemeIconProps = {
  scheme: ColorScheme
  size: number
}

const ColorSchemeIconPropsEq: EqClass.Eq<ColorSchemeIconProps> = EqClass.struct(
  {
    scheme: S.Eq,
    size: N.Eq,
  },
)

const ColorSchemeIconComponent = ({ scheme, size }: ColorSchemeIconProps) => {
  switch (scheme) {
    case 'light':
      return <Sun size={size} className='text-amber-500' />
    case 'dark':
      return (
        <Moon size={size} className='text-purple-600 dark:text-purple-400' />
      )
    case 'auto':
      return <Monitor size={size} className='text-emerald-500' />
  }
}

const ColorSchemeIconMemo = memo(
  ColorSchemeIconComponent,
  ColorSchemeIconPropsEq.equals,
)

type PageViewProps = {
  pageModel: PageModel
  dispatch: Dispatcher<Msg>
}

const PageViewPropsEq: EqClass.Eq<PageViewProps> = EqClass.struct({
  pageModel: EqClass.eqStrict,
  dispatch: EqClass.eqStrict,
})

const PageViewComponent = ({ pageModel, dispatch }: PageViewProps) => {
  const navigateRoute = (route: AppRoute) => {
    dispatch(teaRouterMsg({ _tag: 'ChangeRoute', route }))
  }

  switch (pageModel._tag) {
    case 'HomePageModel':
      return (
        <HomePageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'HomePageMsg', subMsg })}
        />
      )
    case 'BlockPageModel':
      return (
        <BlockPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'BlockPageMsg', subMsg })}
        />
      )
    case 'BoxPageModel':
      return (
        <BoxPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'BoxPageMsg', subMsg })}
        />
      )
    case 'BreadcrumbPageModel':
      return (
        <BreadcrumbPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'BreadcrumbPageMsg', subMsg })}
        />
      )
    case 'ButtonPageModel':
      return (
        <ButtonPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'ButtonPageMsg', subMsg })}
        />
      )
    case 'CardPageModel':
      return (
        <CardPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'CardPageMsg', subMsg })}
        />
      )
    case 'CheckboxPageModel':
      return (
        <CheckboxPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'CheckboxPageMsg', subMsg })}
        />
      )
    case 'ColumnsPageModel':
      return (
        <ColumnsPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'ColumnsPageMsg', subMsg })}
        />
      )
    case 'ContainerPageModel':
      return (
        <ContainerPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'ContainerPageMsg', subMsg })}
        />
      )
    case 'ContentPageModel':
      return (
        <ContentPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'ContentPageMsg', subMsg })}
        />
      )
    case 'DotLoadingPageModel':
      return (
        <DotLoadingPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'DotLoadingPageMsg', subMsg })}
        />
      )
    case 'DeletePageModel':
      return (
        <DeletePageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'DeletePageMsg', subMsg })}
        />
      )
    case 'DropdownPageModel':
      return (
        <DropdownPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'DropdownPageMsg', subMsg })}
        />
      )
    case 'FieldPageModel':
      return (
        <FieldPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'FieldPageMsg', subMsg })}
        />
      )
    case 'FilePageModel':
      return (
        <FilePageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'FilePageMsg', subMsg })}
        />
      )
    case 'FooterPageModel':
      return (
        <FooterPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'FooterPageMsg', subMsg })}
        />
      )
    case 'HeroPageModel':
      return (
        <HeroPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'HeroPageMsg', subMsg })}
        />
      )
    case 'IconPageModel':
      return (
        <IconPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'IconPageMsg', subMsg })}
        />
      )
    case 'ImagePageModel':
      return (
        <ImagePageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'ImagePageMsg', subMsg })}
        />
      )
    case 'InputPageModel':
      return (
        <InputPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'InputPageMsg', subMsg })}
        />
      )
    case 'LevelPageModel':
      return (
        <LevelPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'LevelPageMsg', subMsg })}
        />
      )
    case 'MediaObjectPageModel':
      return (
        <MediaObjectPageMemo
          model={pageModel.model}
          dispatch={(subMsg) =>
            dispatch({ _tag: 'MediaObjectPageMsg', subMsg })
          }
        />
      )
    case 'MenuPageModel':
      return (
        <MenuPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'MenuPageMsg', subMsg })}
        />
      )
    case 'MessagePageModel':
      return (
        <MessagePageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'MessagePageMsg', subMsg })}
        />
      )
    case 'ModalPageModel':
      return (
        <ModalPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'ModalPageMsg', subMsg })}
        />
      )
    case 'NavbarPageModel':
      return (
        <NavbarPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'NavbarPageMsg', subMsg })}
        />
      )
    case 'FloatingSidebarPageModel':
      return (
        <FloatingSidebarPageMemo
          model={pageModel.model}
          dispatch={(subMsg) =>
            dispatch({ _tag: 'FloatingSidebarPageMsg', subMsg })
          }
        />
      )
    case 'SidebarPageModel':
      return (
        <SidebarPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'SidebarPageMsg', subMsg })}
        />
      )
    case 'NotificationPageModel':
      return (
        <NotificationPageMemo
          model={pageModel.model}
          dispatch={(subMsg) =>
            dispatch({ _tag: 'NotificationPageMsg', subMsg })
          }
        />
      )
    case 'PaginationPageModel':
      return (
        <PaginationPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'PaginationPageMsg', subMsg })}
        />
      )
    case 'PanelPageModel':
      return (
        <PanelPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'PanelPageMsg', subMsg })}
        />
      )
    case 'PopoverPageModel':
      return (
        <PopoverPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'PopoverPageMsg', subMsg })}
        />
      )
    case 'ProgressPageModel':
      return (
        <ProgressPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'ProgressPageMsg', subMsg })}
        />
      )
    case 'RadioPageModel':
      return (
        <RadioPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'RadioPageMsg', subMsg })}
        />
      )
    case 'SectionPageModel':
      return (
        <SectionPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'SectionPageMsg', subMsg })}
        />
      )
    case 'SelectPageModel':
      return (
        <SelectPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'SelectPageMsg', subMsg })}
        />
      )
    case 'TablePageModel':
      return (
        <TablePageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'TablePageMsg', subMsg })}
        />
      )
    case 'TabsPageModel':
      return (
        <TabsPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'TabsPageMsg', subMsg })}
        />
      )
    case 'TagPageModel':
      return (
        <TagPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'TagPageMsg', subMsg })}
        />
      )
    case 'TextareaPageModel':
      return (
        <TextareaPageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'TextareaPageMsg', subMsg })}
        />
      )
    case 'TitlePageModel':
      return (
        <TitlePageMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'TitlePageMsg', subMsg })}
        />
      )
    case 'NotFoundPageModel':
      return <NotFoundPageMemo navigateRoute={navigateRoute} />
  }
}

const PageViewMemo = memo(PageViewComponent, PageViewPropsEq.equals)

export type AppProps = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const App = ({ model, dispatch }: AppProps) => {
  const currentRoute = TeaRouter.getRoute(model.router)
  const pageModel = TeaRouter.getPageModel(model.router)

  const activeComponent =
    currentRoute.page._tag === 'HomePage' ||
    currentRoute.page._tag === 'NotFoundPage'
      ? ''
      : currentRoute.page._tag.replace(/Page$/, '').toLowerCase()

  return (
    <div
      data-component='ShowcaseApp'
      className='flex min-h-screen flex-col bg-white font-sans text-gray-900 dark:bg-black dark:text-zinc-100'
    >
      {/* Top Navbar Header */}
      <DsNavbarMemo
        model={model.topNavbarModel}
        config={{
          brandNavItem: {
            key: 'brand',
            label: 'RealWorld Design System',
            href: '/',
            isActive: false,
          },
          desktopNavItems: [
            {
              key: 'home',
              label: 'Home',
              href: '/',
              isActive: currentRoute.page._tag === 'HomePage',
            },
            {
              key: 'elements',
              label: 'Elements',
              href: '/block',
              isActive:
                currentRoute.page._tag !== 'HomePage' &&
                SHOWCASE_CATEGORIES[0].items.some(
                  (i) => i.id === activeComponent,
                ),
            },
            {
              key: 'components',
              label: 'Components',
              href: '/breadcrumb',
              isActive:
                currentRoute.page._tag !== 'HomePage' &&
                SHOWCASE_CATEGORIES[1].items.some(
                  (i) => i.id === activeComponent,
                ),
            },
            {
              key: 'form',
              label: 'Form',
              href: '/field',
              isActive:
                currentRoute.page._tag !== 'HomePage' &&
                SHOWCASE_CATEGORIES[2].items.some(
                  (i) => i.id === activeComponent,
                ),
            },
            {
              key: 'theme',
              label: '',
              isActive: false,
              icon: (
                <ColorSchemeIconMemo scheme={model.colorScheme} size={20} />
              ),
              children: [
                {
                  key: 'theme-light',
                  label: 'Light',
                  isActive: model.colorScheme === 'light',
                  icon: <Sun size={16} className='text-amber-500' />,
                },
                {
                  key: 'theme-dark',
                  label: 'Dark',
                  isActive: model.colorScheme === 'dark',
                  icon: (
                    <Moon
                      size={16}
                      className='text-purple-600 dark:text-purple-400'
                    />
                  ),
                },
                {
                  key: 'theme-auto',
                  label: 'System',
                  isActive: model.colorScheme === 'auto',
                  icon: <Monitor size={16} className='text-emerald-500' />,
                },
              ],
            },
          ],
          mobileNavItems: [],
        }}
        containerClassName='max-w-none w-full xl:w-[70%]'
        dispatch={(subMsg) => dispatch({ _tag: 'TopNavbarMsg', subMsg })}
      />

      {/* Main Layout Container */}
      <DsContainerMemo className='w-full max-w-none flex-1 py-8 xl:w-[70%]'>
        <DsColumnsMemo>
          {/* Left Sidebar Navigation */}
          <DsColumnMemo className='w-full lg:w-auto lg:shrink-0 lg:grow-0'>
            <DsSidebarMemo
              model={model.sidebarModel}
              categories={getSidebarCategories(activeComponent)}
              brandTitle='Showcase'
              dispatch={(subMsg) => dispatch({ _tag: 'SidebarMsg', subMsg })}
              className='rounded-lg border border-gray-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950'
            />
          </DsColumnMemo>

          {/* Main Page Area */}
          <DsColumnMemo className='min-w-0 flex-1'>
            <div className='w-full'>
              <PageViewMemo pageModel={pageModel} dispatch={dispatch} />
            </div>
          </DsColumnMemo>

          {/* Right Sidebar Navigation */}
          <DsColumnMemo className='w-full lg:w-auto lg:shrink-0 lg:grow-0'>
            <DsSidebarMemo
              model={model.rightSidebarModel}
              categories={getRightSidebarCategories()}
              brandTitle='Setting'
              align='right'
              dispatch={(subMsg) =>
                dispatch({ _tag: 'RightSidebarMsg', subMsg })
              }
              className='rounded-lg border border-gray-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950'
            />
          </DsColumnMemo>
        </DsColumnsMemo>
      </DsContainerMemo>

      {/* Footer */}
      <DsFooterMemo />
    </div>
  )
}
