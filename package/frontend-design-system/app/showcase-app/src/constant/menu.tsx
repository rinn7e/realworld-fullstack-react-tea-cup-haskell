import type * as DsSidebar from '@rinn7e/realworld-design-system/component/sidebar'
import {
  AlignLeft,
  BarChart2,
  Bell,
  BookOpen,
  BoxSelect,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Columns,
  CreditCard,
  FileText,
  Film,
  FolderKanban,
  FormInput,
  Globe,
  Heading,
  Image as ImageIcon,
  Layers,
  Layout,
  LayoutGrid,
  ListFilter,
  Loader,
  Loader2,
  Maximize2,
  Menu as MenuIcon,
  MessageSquare,
  MoreHorizontal,
  MousePointerClick,
  Navigation,
  Package,
  PanelBottom,
  PanelLeft,
  PanelRight,
  Paperclip,
  ShieldCheck,
  Smile,
  Sparkles,
  Split,
  Square,
  Table,
  Tag,
  TextCursorInput,
  Trash2,
  Trophy,
} from 'lucide-react'
import React from 'react'

import type { ComponentItem } from '../route/type'
import type { SectionCategory } from '../type'

export type ShowcaseCategory = {
  id: SectionCategory
  title: string
  icon: React.ReactNode
  items: { id: ComponentItem; name: string }[]
}

export const ITEM_ICONS: Record<ComponentItem, React.ReactNode> = {
  // Elements
  block: <Square className='h-4 w-4 text-green-600' />,
  box: <Package className='h-4 w-4 text-green-600' />,
  button: <MousePointerClick className='h-4 w-4 text-green-600' />,
  content: <FileText className='h-4 w-4 text-green-600' />,
  delete: <Trash2 className='h-4 w-4 text-green-600' />,
  icon: <Smile className='h-4 w-4 text-green-600' />,
  image: <ImageIcon className='h-4 w-4 text-green-600' />,
  notification: <Bell className='h-4 w-4 text-green-600' />,
  progress: <Loader2 className='h-4 w-4 text-green-600' />,
  table: <Table className='h-4 w-4 text-green-600' />,
  tag: <Tag className='h-4 w-4 text-green-600' />,
  title: <Heading className='h-4 w-4 text-green-600' />,

  // Components
  breadcrumb: <ChevronRight className='h-4 w-4 text-green-600' />,
  card: <CreditCard className='h-4 w-4 text-green-600' />,
  dropdown: <ChevronDown className='h-4 w-4 text-green-600' />,
  menu: <MenuIcon className='h-4 w-4 text-green-600' />,
  message: <MessageSquare className='h-4 w-4 text-green-600' />,
  modal: <Maximize2 className='h-4 w-4 text-green-600' />,
  navbar: <Navigation className='h-4 w-4 text-green-600' />,
  'floating-sidebar': <PanelRight className='h-4 w-4 text-green-600' />,
  sidebar: <PanelLeft className='h-4 w-4 text-green-600' />,
  pagination: <MoreHorizontal className='h-4 w-4 text-green-600' />,
  panel: <Layout className='h-4 w-4 text-green-600' />,
  popover: <Layers className='h-4 w-4 text-green-600' />,
  tabs: <FolderKanban className='h-4 w-4 text-green-600' />,

  // Form
  field: <FormInput className='h-4 w-4 text-green-600' />,
  input: <TextCursorInput className='h-4 w-4 text-green-600' />,
  textarea: <AlignLeft className='h-4 w-4 text-green-600' />,
  select: <ListFilter className='h-4 w-4 text-green-600' />,
  checkbox: <CheckSquare className='h-4 w-4 text-green-600' />,
  radio: <CircleDot className='h-4 w-4 text-green-600' />,
  file: <Paperclip className='h-4 w-4 text-green-600' />,

  // Layout
  container: <BoxSelect className='h-4 w-4 text-green-600' />,
  hero: <Trophy className='h-4 w-4 text-green-600' />,
  section: <Split className='h-4 w-4 text-green-600' />,
  level: <BarChart2 className='h-4 w-4 text-green-600' />,
  'media-object': <Film className='h-4 w-4 text-green-600' />,
  footer: <PanelBottom className='h-4 w-4 text-green-600' />,

  // Grid
  columns: <Columns className='h-4 w-4 text-green-600' />,

  // Misc
  'dot-loading': <Loader className='h-4 w-4 text-green-600' />,
}

export const SHOWCASE_CATEGORIES: ShowcaseCategory[] = [
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
      { id: 'floating-sidebar', name: 'Floating Sidebar' },
      { id: 'sidebar', name: 'Sidebar' },
      { id: 'pagination', name: 'Pagination' },
      { id: 'panel', name: 'Panel' },
      { id: 'popover', name: 'Popover' },
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
  {
    id: 'misc',
    title: 'Misc',
    icon: <Sparkles className='h-4 w-4 text-green-600' />,
    items: [{ id: 'dot-loading', name: 'Dot Loading' }],
  },
]

export const getSidebarCategories = (
  activeComponent: string,
): DsSidebar.SidebarCategory[] =>
  SHOWCASE_CATEGORIES.map((cat) => ({
    title: cat.title,
    items: cat.items.map((item) => ({
      key: item.id,
      label: item.name,
      href: `#/${item.id}`,
      isActive: activeComponent === item.id,
      icon: ITEM_ICONS[item.id] || cat.icon,
    })),
  }))

export const getRightSidebarCategories = (): DsSidebar.SidebarCategory[] => [
  {
    title: 'Applications',
    items: [
      {
        key: 'frontend-web',
        label: 'Frontend Web',
        href: 'http://localhost:5173/',
        isActive: false,
        icon: <Globe className='h-4 w-4 text-green-600' />,
        isNewTab: true,
      },
      {
        key: 'frontend-admin',
        label: 'Frontend Admin',
        href: 'http://localhost:5174/',
        isActive: false,
        icon: <ShieldCheck className='h-4 w-4 text-green-600' />,
        isNewTab: true,
      },
    ],
  },
]
