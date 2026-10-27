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
import { BlockScreenMemo } from '@/screen/block-screen/component'
import { BoxScreenMemo } from '@/screen/box-screen/component'
import { BreadcrumbScreenMemo } from '@/screen/breadcrumb-screen/component'
import { ButtonScreenMemo } from '@/screen/button-screen/component'
import { CardScreenMemo } from '@/screen/card-screen/component'
import { CheckboxScreenMemo } from '@/screen/checkbox-screen/component'
import { ColumnsScreenMemo } from '@/screen/columns-screen/component'
import { ContainerScreenMemo } from '@/screen/container-screen/component'
import { ContentScreenMemo } from '@/screen/content-screen/component'
import { DeleteScreenMemo } from '@/screen/delete-screen/component'
import { DotLoadingScreenMemo } from '@/screen/dot-loading-screen/component'
import { DropdownScreenMemo } from '@/screen/dropdown-screen/component'
import { FieldScreenMemo } from '@/screen/field-screen/component'
import { FileScreenMemo } from '@/screen/file-screen/component'
import { FloatingSidebarScreenMemo } from '@/screen/floating-sidebar-screen/component'
import { FooterScreenMemo } from '@/screen/footer-screen/component'
import { HeroScreenMemo } from '@/screen/hero-screen/component'
import { HomeScreenMemo } from '@/screen/home-screen/component'
import { IconScreenMemo } from '@/screen/icon-screen/component'
import { ImageScreenMemo } from '@/screen/image-screen/component'
import { InputScreenMemo } from '@/screen/input-screen/component'
import { LevelScreenMemo } from '@/screen/level-screen/component'
import { MediaObjectScreenMemo } from '@/screen/media-object-screen/component'
import { MenuScreenMemo } from '@/screen/menu-screen/component'
import { MessageScreenMemo } from '@/screen/message-screen/component'
import { ModalScreenMemo } from '@/screen/modal-screen/component'
import { NavbarScreenMemo } from '@/screen/navbar-screen/component'
import { NotFoundScreenMemo } from '@/screen/not-found-screen/component'
import { NotificationScreenMemo } from '@/screen/notification-screen/component'
import { PaginationScreenMemo } from '@/screen/pagination-screen/component'
import { PanelScreenMemo } from '@/screen/panel-screen/component'
import { PopoverScreenMemo } from '@/screen/popover-screen/component'
import { ProgressScreenMemo } from '@/screen/progress-screen/component'
import { RadioScreenMemo } from '@/screen/radio-screen/component'
import { SectionScreenMemo } from '@/screen/section-screen/component'
import { SelectScreenMemo } from '@/screen/select-screen/component'
import { SidebarScreenMemo } from '@/screen/sidebar-screen/component'
import { TableScreenMemo } from '@/screen/table-screen/component'
import { TabsScreenMemo } from '@/screen/tabs-screen/component'
import { TagScreenMemo } from '@/screen/tag-screen/component'
import { TextareaScreenMemo } from '@/screen/textarea-screen/component'
import { TitleScreenMemo } from '@/screen/title-screen/component'
import type { ColorScheme } from '@/theme/type'

import { type Model, type Msg, type ScreenModel, teaRouterMsg } from './type'

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

type ScreenViewProps = {
  pageModel: ScreenModel
  dispatch: Dispatcher<Msg>
}

const ScreenViewPropsEq: EqClass.Eq<ScreenViewProps> = EqClass.struct({
  pageModel: EqClass.eqStrict,
  dispatch: EqClass.eqStrict,
})

const ScreenViewComponent = ({ pageModel, dispatch }: ScreenViewProps) => {
  const navigateRoute = (route: AppRoute) => {
    dispatch(teaRouterMsg({ _tag: 'ChangeRoute', route }))
  }

  switch (pageModel._tag) {
    case 'HomeScreenModel':
      return (
        <HomeScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'HomeScreenMsg', subMsg })}
        />
      )
    case 'BlockScreenModel':
      return (
        <BlockScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'BlockScreenMsg', subMsg })}
        />
      )
    case 'BoxScreenModel':
      return (
        <BoxScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'BoxScreenMsg', subMsg })}
        />
      )
    case 'BreadcrumbScreenModel':
      return (
        <BreadcrumbScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) =>
            dispatch({ _tag: 'BreadcrumbScreenMsg', subMsg })
          }
        />
      )
    case 'ButtonScreenModel':
      return (
        <ButtonScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'ButtonScreenMsg', subMsg })}
        />
      )
    case 'CardScreenModel':
      return (
        <CardScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'CardScreenMsg', subMsg })}
        />
      )
    case 'CheckboxScreenModel':
      return (
        <CheckboxScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'CheckboxScreenMsg', subMsg })}
        />
      )
    case 'ColumnsScreenModel':
      return (
        <ColumnsScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'ColumnsScreenMsg', subMsg })}
        />
      )
    case 'ContainerScreenModel':
      return (
        <ContainerScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) =>
            dispatch({ _tag: 'ContainerScreenMsg', subMsg })
          }
        />
      )
    case 'ContentScreenModel':
      return (
        <ContentScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'ContentScreenMsg', subMsg })}
        />
      )
    case 'DotLoadingScreenModel':
      return (
        <DotLoadingScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) =>
            dispatch({ _tag: 'DotLoadingScreenMsg', subMsg })
          }
        />
      )
    case 'DeleteScreenModel':
      return (
        <DeleteScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'DeleteScreenMsg', subMsg })}
        />
      )
    case 'DropdownScreenModel':
      return (
        <DropdownScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'DropdownScreenMsg', subMsg })}
        />
      )
    case 'FieldScreenModel':
      return (
        <FieldScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'FieldScreenMsg', subMsg })}
        />
      )
    case 'FileScreenModel':
      return (
        <FileScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'FileScreenMsg', subMsg })}
        />
      )
    case 'FooterScreenModel':
      return (
        <FooterScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'FooterScreenMsg', subMsg })}
        />
      )
    case 'HeroScreenModel':
      return (
        <HeroScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'HeroScreenMsg', subMsg })}
        />
      )
    case 'IconScreenModel':
      return (
        <IconScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'IconScreenMsg', subMsg })}
        />
      )
    case 'ImageScreenModel':
      return (
        <ImageScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'ImageScreenMsg', subMsg })}
        />
      )
    case 'InputScreenModel':
      return (
        <InputScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'InputScreenMsg', subMsg })}
        />
      )
    case 'LevelScreenModel':
      return (
        <LevelScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'LevelScreenMsg', subMsg })}
        />
      )
    case 'MediaObjectScreenModel':
      return (
        <MediaObjectScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) =>
            dispatch({ _tag: 'MediaObjectScreenMsg', subMsg })
          }
        />
      )
    case 'MenuScreenModel':
      return (
        <MenuScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'MenuScreenMsg', subMsg })}
        />
      )
    case 'MessageScreenModel':
      return (
        <MessageScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'MessageScreenMsg', subMsg })}
        />
      )
    case 'ModalScreenModel':
      return (
        <ModalScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'ModalScreenMsg', subMsg })}
        />
      )
    case 'NavbarScreenModel':
      return (
        <NavbarScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'NavbarScreenMsg', subMsg })}
        />
      )
    case 'FloatingSidebarScreenModel':
      return (
        <FloatingSidebarScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) =>
            dispatch({ _tag: 'FloatingSidebarScreenMsg', subMsg })
          }
        />
      )
    case 'SidebarScreenModel':
      return (
        <SidebarScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'SidebarScreenMsg', subMsg })}
        />
      )
    case 'NotificationScreenModel':
      return (
        <NotificationScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) =>
            dispatch({ _tag: 'NotificationScreenMsg', subMsg })
          }
        />
      )
    case 'PaginationScreenModel':
      return (
        <PaginationScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) =>
            dispatch({ _tag: 'PaginationScreenMsg', subMsg })
          }
        />
      )
    case 'PanelScreenModel':
      return (
        <PanelScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'PanelScreenMsg', subMsg })}
        />
      )
    case 'PopoverScreenModel':
      return (
        <PopoverScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'PopoverScreenMsg', subMsg })}
        />
      )
    case 'ProgressScreenModel':
      return (
        <ProgressScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'ProgressScreenMsg', subMsg })}
        />
      )
    case 'RadioScreenModel':
      return (
        <RadioScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'RadioScreenMsg', subMsg })}
        />
      )
    case 'SectionScreenModel':
      return (
        <SectionScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'SectionScreenMsg', subMsg })}
        />
      )
    case 'SelectScreenModel':
      return (
        <SelectScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'SelectScreenMsg', subMsg })}
        />
      )
    case 'TableScreenModel':
      return (
        <TableScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'TableScreenMsg', subMsg })}
        />
      )
    case 'TabsScreenModel':
      return (
        <TabsScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'TabsScreenMsg', subMsg })}
        />
      )
    case 'TagScreenModel':
      return (
        <TagScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'TagScreenMsg', subMsg })}
        />
      )
    case 'TextareaScreenModel':
      return (
        <TextareaScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'TextareaScreenMsg', subMsg })}
        />
      )
    case 'TitleScreenModel':
      return (
        <TitleScreenMemo
          model={pageModel.model}
          dispatch={(subMsg) => dispatch({ _tag: 'TitleScreenMsg', subMsg })}
        />
      )
    case 'NotFoundScreenModel':
      return <NotFoundScreenMemo navigateRoute={navigateRoute} />
  }
}

const ScreenViewMemo = memo(ScreenViewComponent, ScreenViewPropsEq.equals)

export type AppProps = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const App = ({ model, dispatch }: AppProps) => {
  const currentRoute = TeaRouter.getRoute(model.router)
  const pageModel = TeaRouter.getPageModel(model.router)

  const activeComponent =
    currentRoute.page._tag === 'PageHome' ||
    currentRoute.page._tag === 'PageNotFound'
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
              isActive: currentRoute.page._tag === 'PageHome',
            },
            {
              key: 'elements',
              label: 'Elements',
              href: '/block',
              isActive:
                currentRoute.page._tag !== 'PageHome' &&
                SHOWCASE_CATEGORIES[0].items.some(
                  (i) => i.id === activeComponent,
                ),
            },
            {
              key: 'components',
              label: 'Components',
              href: '/breadcrumb',
              isActive:
                currentRoute.page._tag !== 'PageHome' &&
                SHOWCASE_CATEGORIES[1].items.some(
                  (i) => i.id === activeComponent,
                ),
            },
            {
              key: 'form',
              label: 'Form',
              href: '/field',
              isActive:
                currentRoute.page._tag !== 'PageHome' &&
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

          {/* Main Screen Area */}
          <DsColumnMemo className='min-w-0 flex-1'>
            <div className='w-full'>
              <ScreenViewMemo pageModel={pageModel} dispatch={dispatch} />
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
