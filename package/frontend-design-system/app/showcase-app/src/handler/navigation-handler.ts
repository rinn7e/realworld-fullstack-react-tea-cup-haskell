import { Cmd } from 'tea-cup-fp'

import {
  type Destination,
  DestinationEq,
  type NavigationMsg,
} from '@/common/type/destination'
import * as BlockScreen from '@/screen/block-screen'
import * as BoxScreen from '@/screen/box-screen'
import * as BreadcrumbScreen from '@/screen/breadcrumb-screen'
import * as ButtonScreen from '@/screen/button-screen'
import * as CardScreen from '@/screen/card-screen'
import * as CheckboxScreen from '@/screen/checkbox-screen'
import * as ColumnsScreen from '@/screen/columns-screen'
import * as ContainerScreen from '@/screen/container-screen'
import * as ContentScreen from '@/screen/content-screen'
import * as DeleteScreen from '@/screen/delete-screen'
import * as DotLoadingScreen from '@/screen/dot-loading-screen'
import * as DropdownScreen from '@/screen/dropdown-screen'
import * as FieldScreen from '@/screen/field-screen'
import * as FileScreen from '@/screen/file-screen'
import * as FloatingSidebarScreen from '@/screen/floating-sidebar-screen'
import * as FooterScreen from '@/screen/footer-screen'
import * as HeroScreen from '@/screen/hero-screen'
import * as HomeScreen from '@/screen/home-screen'
import * as IconScreen from '@/screen/icon-screen'
import * as ImageScreen from '@/screen/image-screen'
import * as InputScreen from '@/screen/input-screen'
import * as LevelScreen from '@/screen/level-screen'
import * as MediaObjectScreen from '@/screen/media-object-screen'
import * as MenuScreen from '@/screen/menu-screen'
import * as MessageScreen from '@/screen/message-screen'
import * as ModalScreen from '@/screen/modal-screen'
import * as NavbarScreen from '@/screen/navbar-screen'
import * as NotFoundScreen from '@/screen/not-found-screen'
import * as NotificationScreen from '@/screen/notification-screen'
import * as PaginationScreen from '@/screen/pagination-screen'
import * as PanelScreen from '@/screen/panel-screen'
import * as PopoverScreen from '@/screen/popover-screen'
import * as ProgressScreen from '@/screen/progress-screen'
import * as RadioScreen from '@/screen/radio-screen'
import * as SectionScreen from '@/screen/section-screen'
import * as SelectScreen from '@/screen/select-screen'
import * as SidebarScreen from '@/screen/sidebar-screen'
import * as TableScreen from '@/screen/table-screen'
import * as TabsScreen from '@/screen/tabs-screen'
import * as TagScreen from '@/screen/tag-screen'
import * as TextareaScreen from '@/screen/textarea-screen'
import * as TitleScreen from '@/screen/title-screen'
import { type Model, type Msg, type ScreenModel } from '@/type'
import { destinationOf } from '@/util'

// The screen model of `destination`. Every move opens its screen afresh:
// no showcase screen keeps state across a move.
export const initScreenModel = (
  destination: Destination,
): [ScreenModel, Cmd<Msg>] => {
  switch (destination.screen._tag) {
    case 'HomeScreen': {
      const [homeModel, homeCmd] = HomeScreen.init()
      return [
        { _tag: 'HomeScreenModel', model: homeModel },
        homeCmd.map((subMsg) => ({ _tag: 'HomeScreenMsg', subMsg })),
      ]
    }

    case 'BlockScreen': {
      const [subModel, subCmd] = BlockScreen.init()
      return [
        { _tag: 'BlockScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'BlockScreenMsg', subMsg })),
      ]
    }

    case 'BoxScreen': {
      const [subModel, subCmd] = BoxScreen.init()
      return [
        { _tag: 'BoxScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'BoxScreenMsg', subMsg })),
      ]
    }

    case 'ButtonScreen': {
      const [subModel, subCmd] = ButtonScreen.init()
      return [
        { _tag: 'ButtonScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ButtonScreenMsg', subMsg })),
      ]
    }

    case 'ContentScreen': {
      const [subModel, subCmd] = ContentScreen.init()
      return [
        { _tag: 'ContentScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ContentScreenMsg', subMsg })),
      ]
    }

    case 'DeleteScreen': {
      const [subModel, subCmd] = DeleteScreen.init()
      return [
        { _tag: 'DeleteScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'DeleteScreenMsg', subMsg })),
      ]
    }

    case 'IconScreen': {
      const [subModel, subCmd] = IconScreen.init()
      return [
        { _tag: 'IconScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'IconScreenMsg', subMsg })),
      ]
    }

    case 'ImageScreen': {
      const [subModel, subCmd] = ImageScreen.init()
      return [
        { _tag: 'ImageScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ImageScreenMsg', subMsg })),
      ]
    }

    case 'NotificationScreen': {
      const [subModel, subCmd] = NotificationScreen.init()
      return [
        { _tag: 'NotificationScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'NotificationScreenMsg', subMsg })),
      ]
    }

    case 'ProgressScreen': {
      const [subModel, subCmd] = ProgressScreen.init()
      return [
        { _tag: 'ProgressScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ProgressScreenMsg', subMsg })),
      ]
    }

    case 'TableScreen': {
      const [subModel, subCmd] = TableScreen.init()
      return [
        { _tag: 'TableScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TableScreenMsg', subMsg })),
      ]
    }

    case 'TagScreen': {
      const [subModel, subCmd] = TagScreen.init()
      return [
        { _tag: 'TagScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TagScreenMsg', subMsg })),
      ]
    }

    case 'TitleScreen': {
      const [subModel, subCmd] = TitleScreen.init()
      return [
        { _tag: 'TitleScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TitleScreenMsg', subMsg })),
      ]
    }

    case 'BreadcrumbScreen': {
      const [subModel, subCmd] = BreadcrumbScreen.init()
      return [
        { _tag: 'BreadcrumbScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'BreadcrumbScreenMsg', subMsg })),
      ]
    }

    case 'CardScreen': {
      const [subModel, subCmd] = CardScreen.init()
      return [
        { _tag: 'CardScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'CardScreenMsg', subMsg })),
      ]
    }

    case 'DropdownScreen': {
      const [subModel, subCmd] = DropdownScreen.init()
      return [
        { _tag: 'DropdownScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'DropdownScreenMsg', subMsg })),
      ]
    }

    case 'MenuScreen': {
      const [subModel, subCmd] = MenuScreen.init()
      return [
        { _tag: 'MenuScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'MenuScreenMsg', subMsg })),
      ]
    }

    case 'MessageScreen': {
      const [subModel, subCmd] = MessageScreen.init()
      return [
        { _tag: 'MessageScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'MessageScreenMsg', subMsg })),
      ]
    }

    case 'ModalScreen': {
      const [subModel, subCmd] = ModalScreen.init()
      return [
        { _tag: 'ModalScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ModalScreenMsg', subMsg })),
      ]
    }

    case 'NavbarScreen': {
      const [subModel, subCmd] = NavbarScreen.init()
      return [
        { _tag: 'NavbarScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'NavbarScreenMsg', subMsg })),
      ]
    }

    case 'FloatingSidebarScreen': {
      const [subModel, subCmd] = FloatingSidebarScreen.init()
      return [
        { _tag: 'FloatingSidebarScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FloatingSidebarScreenMsg', subMsg })),
      ]
    }

    case 'SidebarScreen': {
      const [subModel, subCmd] = SidebarScreen.init()
      return [
        { _tag: 'SidebarScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'SidebarScreenMsg', subMsg })),
      ]
    }

    case 'PaginationScreen': {
      const [subModel, subCmd] = PaginationScreen.init()
      return [
        { _tag: 'PaginationScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'PaginationScreenMsg', subMsg })),
      ]
    }

    case 'PanelScreen': {
      const [subModel, subCmd] = PanelScreen.init()
      return [
        { _tag: 'PanelScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'PanelScreenMsg', subMsg })),
      ]
    }

    case 'PopoverScreen': {
      const [subModel, subCmd] = PopoverScreen.init()
      return [
        { _tag: 'PopoverScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'PopoverScreenMsg', subMsg })),
      ]
    }

    case 'TabsScreen': {
      const [subModel, subCmd] = TabsScreen.init()
      return [
        { _tag: 'TabsScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TabsScreenMsg', subMsg })),
      ]
    }

    case 'FieldScreen': {
      const [subModel, subCmd] = FieldScreen.init()
      return [
        { _tag: 'FieldScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FieldScreenMsg', subMsg })),
      ]
    }

    case 'InputScreen': {
      const [subModel, subCmd] = InputScreen.init()
      return [
        { _tag: 'InputScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'InputScreenMsg', subMsg })),
      ]
    }

    case 'TextareaScreen': {
      const [subModel, subCmd] = TextareaScreen.init()
      return [
        { _tag: 'TextareaScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'TextareaScreenMsg', subMsg })),
      ]
    }

    case 'SelectScreen': {
      const [subModel, subCmd] = SelectScreen.init()
      return [
        { _tag: 'SelectScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'SelectScreenMsg', subMsg })),
      ]
    }

    case 'CheckboxScreen': {
      const [subModel, subCmd] = CheckboxScreen.init()
      return [
        { _tag: 'CheckboxScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'CheckboxScreenMsg', subMsg })),
      ]
    }

    case 'RadioScreen': {
      const [subModel, subCmd] = RadioScreen.init()
      return [
        { _tag: 'RadioScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'RadioScreenMsg', subMsg })),
      ]
    }

    case 'FileScreen': {
      const [subModel, subCmd] = FileScreen.init()
      return [
        { _tag: 'FileScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FileScreenMsg', subMsg })),
      ]
    }

    case 'ContainerScreen': {
      const [subModel, subCmd] = ContainerScreen.init()
      return [
        { _tag: 'ContainerScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ContainerScreenMsg', subMsg })),
      ]
    }

    case 'HeroScreen': {
      const [subModel, subCmd] = HeroScreen.init()
      return [
        { _tag: 'HeroScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'HeroScreenMsg', subMsg })),
      ]
    }

    case 'SectionScreen': {
      const [subModel, subCmd] = SectionScreen.init()
      return [
        { _tag: 'SectionScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'SectionScreenMsg', subMsg })),
      ]
    }

    case 'LevelScreen': {
      const [subModel, subCmd] = LevelScreen.init()
      return [
        { _tag: 'LevelScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'LevelScreenMsg', subMsg })),
      ]
    }

    case 'MediaObjectScreen': {
      const [subModel, subCmd] = MediaObjectScreen.init()
      return [
        { _tag: 'MediaObjectScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'MediaObjectScreenMsg', subMsg })),
      ]
    }

    case 'FooterScreen': {
      const [subModel, subCmd] = FooterScreen.init()
      return [
        { _tag: 'FooterScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'FooterScreenMsg', subMsg })),
      ]
    }

    case 'ColumnsScreen': {
      const [subModel, subCmd] = ColumnsScreen.init()
      return [
        { _tag: 'ColumnsScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'ColumnsScreenMsg', subMsg })),
      ]
    }

    case 'DotLoadingScreen': {
      const [subModel, subCmd] = DotLoadingScreen.init()
      return [
        { _tag: 'DotLoadingScreenModel', model: subModel },
        subCmd.map((subMsg) => ({ _tag: 'DotLoadingScreenMsg', subMsg })),
      ]
    }

    case 'NotFoundScreen': {
      const [notFoundModel, notFoundCmd] = NotFoundScreen.init()
      return [
        { _tag: 'NotFoundScreenModel', model: notFoundModel },
        notFoundCmd.map((subMsg) => ({ _tag: 'NotFoundScreenMsg', subMsg })),
      ]
    }
  }
}

// Opens `destination`. A move to the destination shown is dropped when it
// comes from the URL (`isInternal` false), unless refreshed; the app's own
// moves always open it again (a click on the screen shown refreshes it).
// The showcase has no guard: every destination can be shown.
export const navigateHandler =
  (destination: Destination, isInternal: boolean, forceRefresh: boolean) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (
      !isInternal &&
      !forceRefresh &&
      DestinationEq.equals(destinationOf(model), destination)
    ) {
      return [model, Cmd.none()]
    } else {
      const [screenModel, screenCmd] = initScreenModel(destination)
      return [{ ...model, screenModel }, screenCmd]
    }
  }

// The destination a `NavigationMsg` moves to
const targetDestinationOf = (
  subMsg: NavigationMsg,
  currentDestination: Destination,
): Destination => {
  switch (subMsg._tag) {
    case 'Navigate':
      return subMsg.destination
    case 'ModifyDestination':
      return subMsg.func(currentDestination)
    case 'Refresh':
      return currentDestination
    case 'UrlChanged':
      return subMsg.destination
  }
}

// Every move of the app. The URL follows the destination after the step
// (`withUrl`), so nothing here writes it.
export const navigationMsgHandler = (
  subMsg: NavigationMsg,
  model: Model,
): [Model, Cmd<Msg>] =>
  navigateHandler(
    targetDestinationOf(subMsg, destinationOf(model)),
    subMsg._tag !== 'UrlChanged',
    subMsg._tag === 'Refresh' ||
      ((subMsg._tag === 'Navigate' || subMsg._tag === 'ModifyDestination') &&
        subMsg.forceRefresh === true),
  )(model)
