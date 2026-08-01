import React from 'react'
import {
  Block,
  Box,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Column,
  Columns,
  Container,
  Content,
  Delete,
  Dropdown,
  Field,
  File,
  Footer,
  Hero,
  Icon,
  Image,
  Input,
  Level,
  MediaObject,
  Menu,
  Message,
  Modal,
  Navbar,
  Notification,
  Pagination,
  Panel,
  Progress,
  Radio,
  Section,
  Select,
  Tabs,
  Tag,
  Textarea,
  Title,
} from '@rinn7e/realworld-design-system'
import {
  BookOpen,
  Code2,
  Layers,
  LayoutGrid,
  Search,
  Sparkles,
} from 'lucide-react'

import type { ComponentItem, Model, Msg, SectionCategory } from './type'

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

  const menuCategories: Menu.MenuCategory[] = categories.map((cat) => ({
    title: cat.title,
    items: cat.items.map((item) => ({
      id: item.id,
      label: item.name,
      isActive: model.activeComponent === item.id,
    })),
  }))

  const renderComponentPreview = () => {
    switch (model.activeComponent) {
      case 'button':
        return {
          title: 'Button',
          subtitle:
            'The classic Conduit RealWorld button element in different colors, sizes, and states.',
          canvas: (
            <div className='flex flex-wrap items-center gap-3'>
              {Button.view({ variant: 'default', children: 'Default' })}
              {Button.view({ variant: 'primary', children: 'Primary' })}
              {Button.view({ variant: 'link', children: 'Link' })}
              {Button.view({ variant: 'info', children: 'Info' })}
              {Button.view({ variant: 'success', children: 'Success' })}
              {Button.view({ variant: 'warning', children: 'Warning' })}
              {Button.view({ variant: 'danger', children: 'Danger' })}
              {Button.view({
                variant: 'primary',
                isOutlined: true,
                children: 'Outlined',
              })}
              {Button.view({
                variant: 'primary',
                isRounded: true,
                children: 'Rounded',
              })}
              {Button.view({
                variant: 'primary',
                isLoading: true,
                children: 'Loading',
              })}
            </div>
          ),
          code: `{Button.view({ variant: 'primary', children: 'Primary' })}
{Button.view({ variant: 'primary', isOutlined: true, children: 'Outlined' })}
{Button.view({ variant: 'primary', isRounded: true, children: 'Rounded' })}
{Button.view({ variant: 'danger', isLoading: true, children: 'Loading' })}`,
        }

      case 'box':
        return {
          title: 'Box',
          subtitle:
            'A white container box with border shadow to group content.',
          canvas: Box.view({
            className: 'w-full',
            children: (
              <>
                {Title.view({
                  size: 4,
                  className: 'mb-1 font-bold text-gray-900',
                  children: 'Interactive Box Container',
                })}
                {Content.view({
                  size: 'normal',
                  className: 'text-gray-600',
                  children:
                    'This is a classic Bulma-styled box container wrapped in pure Tailwind CSS styles matching Conduit RealWorld frontend-web.',
                })}
              </>
            ),
          }),
          code: `{Box.view({
  children: (
    <>
      {Title.view({ size: 4, children: 'Interactive Box Container' })}
      {Content.view({ children: 'This is a classic Bulma-styled box container.' })}
    </>
  )
})}`,
        }

      case 'block':
        return {
          title: 'Block',
          subtitle: 'Simple layout block element with vertical spacing.',
          canvas: (
            <div className='w-full space-y-3'>
              {Block.view({
                children: (
                  <p className='rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700'>
                    First Layout Block Container
                  </p>
                ),
              })}
              {Block.view({
                children: (
                  <p className='rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700'>
                    Second Layout Block Container
                  </p>
                ),
              })}
            </div>
          ),
          code: `{Block.view({ children: <p>First Block</p> })}
{Block.view({ children: <p>Second Block</p> })}`,
        }

      case 'content':
        return {
          title: 'Content',
          subtitle: 'Typography content wrapper for rich text formatting.',
          canvas: Content.view({
            className: 'w-full text-left',
            children: (
              <>
                <h2 className='text-xl font-bold text-gray-900 mb-2'>
                  Bulma Typography Content
                </h2>
                <p className='text-gray-600 mb-3'>
                  Conduit RealWorld article markdown text formatted with clean line height and font weights.
                </p>
                <ul className='list-disc pl-5 space-y-1 text-gray-700 text-sm'>
                  <li>Pure TypeScript &amp; React 19 architecture</li>
                  <li>Stateless presentation views</li>
                  <li>Functional Elm-style architecture</li>
                </ul>
              </>
            ),
          }),
          code: `{Content.view({
  children: (
    <>
      <h2>Title</h2>
      <p>Body text...</p>
    </>
  )
})}`,
        }

      case 'delete':
        return {
          title: 'Delete',
          subtitle: 'Bulma-inspired standalone delete icon button element.',
          canvas: (
            <div className='flex items-center gap-6'>
              <div className='flex flex-col items-center gap-2'>
                <span className='text-xs text-gray-500'>Small</span>
                {Delete.view({
                  size: 'small',
                  onClick: () => alert('Deleted!'),
                })}
              </div>
              <div className='flex flex-col items-center gap-2'>
                <span className='text-xs text-gray-500'>Normal</span>
                {Delete.view({
                  size: 'normal',
                  onClick: () => alert('Deleted!'),
                })}
              </div>
              <div className='flex flex-col items-center gap-2'>
                <span className='text-xs text-gray-500'>Medium</span>
                {Delete.view({
                  size: 'medium',
                  onClick: () => alert('Deleted!'),
                })}
              </div>
              <div className='flex flex-col items-center gap-2'>
                <span className='text-xs text-gray-500'>Large</span>
                {Delete.view({
                  size: 'large',
                  onClick: () => alert('Deleted!'),
                })}
              </div>
            </div>
          ),
          code: `{Delete.view({ size: 'small', onClick: handleDelete })}
{Delete.view({ size: 'normal', onClick: handleDelete })}
{Delete.view({ size: 'large', onClick: handleDelete })}`,
        }

      case 'icon':
        return {
          title: 'Icon',
          subtitle: 'Icon wrapper container for Lucide icons.',
          canvas: (
            <div className='flex items-center gap-6 text-gray-700'>
              {Icon.view({
                children: <Sparkles className='h-6 w-6 text-green-600' />,
              })}
              {Icon.view({
                children: <Search className='h-6 w-6 text-sky-500' />,
              })}
              {Icon.view({
                children: <Layers className='h-6 w-6 text-amber-500' />,
              })}
              {Icon.view({
                children: <BookOpen className='h-6 w-6 text-rose-500' />,
              })}
            </div>
          ),
          code: `{Icon.view({ children: <Sparkles className='h-6 w-6 text-green-600' /> })}`,
        }

      case 'image':
        return {
          title: 'Image',
          subtitle: 'Responsive image container with fixed aspect ratios.',
          canvas: (
            <div className='w-full max-w-sm space-y-4'>
              {Image.view({
                src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                ratio: '16by9',
                alt: 'Banner image',
              })}
              <div className='flex items-center gap-3'>
                {Image.view({
                  src: 'https://api.realworld.io/images/demo-avatar.png',
                  size: '48x48',
                  isRounded: true,
                  alt: 'User avatar',
                })}
                <span className='text-sm font-semibold text-gray-800'>
                  Eric Simons (Author)
                </span>
              </div>
            </div>
          ),
          code: `{Image.view({ src: '...', ratio: '16by9' })}
{Image.view({ src: '...', size: '48x48', isRounded: true })}`,
        }

      case 'table':
        return {
          title: 'Table',
          subtitle: 'Styled data table for tabular information display.',
          canvas: (
            <div className='w-full overflow-x-auto'>
              {Table.view({
                isBordered: true,
                isStriped: true,
                isHoverable: true,
                isFullWidth: true,
                headers: ['Article Title', 'Author', 'Favorites', 'Date'],
                rows: [
                  [
                    'Create a design system in TypeScript',
                    'Eric Simons',
                    '1,420',
                    'Jan 20, 2026',
                  ],
                  [
                    'Explore Elm Architecture with React TEA',
                    'Albert Pai',
                    '980',
                    'Jan 18, 2026',
                  ],
                  [
                    'Building Fullstack Applications',
                    'Rinn7e',
                    '2,150',
                    'Jan 15, 2026',
                  ],
                ],
              })}
            </div>
          ),
          code: `{Table.view({
  isBordered: true,
  isStriped: true,
  headers: ['Title', 'Author', 'Favorites'],
  rows: [['Article 1', 'Eric', '120']]
})}`,
        }

      case 'title':
        return {
          title: 'Title',
          subtitle: 'Heading typography sizes (1 through 6).',
          canvas: (
            <div className='space-y-2 text-left'>
              {Title.view({ size: 1, children: 'Title Size 1' })}
              {Title.view({ size: 2, children: 'Title Size 2' })}
              {Title.view({ size: 3, children: 'Title Size 3' })}
              {Title.view({ size: 4, children: 'Title Size 4' })}
              {Title.view({ size: 5, children: 'Title Size 5' })}
              {Title.view({ size: 6, children: 'Title Size 6' })}
            </div>
          ),
          code: `{Title.view({ size: 1, children: 'Title Size 1' })}
{Title.view({ size: 3, children: 'Title Size 3' })}`,
        }

      case 'card':
        return {
          title: 'Card',
          subtitle:
            'A flexible and extensible content container with header, image, body, and footer.',
          canvas: (
            <div className='w-full max-w-sm'>
              {Card.view({
                header: 'John Smith',
                image: Image.view({
                  src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                  ratio: '16by9',
                }),
                footer: (
                  <div className='flex w-full items-center justify-between'>
                    <span className='text-xs text-gray-500'>
                      Posted 2 days ago
                    </span>
                    {Button.view({
                      size: 'small',
                      variant: 'link',
                      children: 'Read More',
                    })}
                  </div>
                ),
                children: Content.view({
                  size: 'normal',
                  className: 'text-gray-600',
                  children:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.',
                }),
              })}
            </div>
          ),
          code: `{Card.view({
  header: 'John Smith',
  image: Image.view({ src: '...', ratio: '16by9' }),
  footer: Button.view({ size: 'small', children: 'Read More' }),
  children: Content.view({ children: 'Lorem ipsum dolor sit amet...' })
})}`,
        }

      case 'tag':
        return {
          title: 'Tag',
          subtitle:
            'Small tag badges for labels, categories, and keyword filters.',
          canvas: (
            <div className='flex flex-wrap items-center gap-2'>
              {Tag.view({ variant: 'default', children: 'default-tag' })}
              {Tag.view({ variant: 'primary', children: 'conduit' })}
              {Tag.view({ variant: 'link', children: 'react' })}
              {Tag.view({ variant: 'info', isRounded: true, children: 'info' })}
              {Tag.view({
                variant: 'success',
                isLight: true,
                children: 'success',
              })}
              {Tag.view({ variant: 'warning', children: 'warning' })}
              {Tag.view({
                variant: 'danger',
                onDelete: () => alert('Deleted tag!'),
                children: 'with-delete',
              })}
            </div>
          ),
          code: `{Tag.view({ variant: 'primary', children: 'conduit' })}
{Tag.view({ variant: 'info', isRounded: true, children: 'info' })}
{Tag.view({ variant: 'danger', onDelete: handleDelete, children: 'with-delete' })}`,
        }

      case 'dropdown':
        return {
          title: 'Dropdown',
          subtitle:
            'Interactive dropdown menu component with TEA state handling.',
          canvas: Dropdown.view({
            triggerLabel: 'Select Option',
            items: [
              { id: 'opt1', label: 'Option 1' },
              { id: 'opt2', label: 'Option 2' },
              { id: 'div1', label: '', isDivider: true },
              { id: 'opt3', label: 'Settings' },
            ],
            model: model.dropdownModel,
            dispatch: (subMsg: Dropdown.Msg) =>
              dispatch({ _tag: 'DropdownMsg', subMsg }),
          }),
          code: `{Dropdown.view({
  triggerLabel: 'Select Option',
  items: [
    { id: 'opt1', label: 'Option 1' },
    { id: 'opt2', label: 'Option 2' }
  ],
  model: model.dropdownModel,
  dispatch: dispatch
})}`,
        }

      case 'breadcrumb':
        return {
          title: 'Breadcrumb',
          subtitle: 'Horizontal breadcrumb navigation for multi-level paths.',
          canvas: Breadcrumb.view({
            items: [
              { label: 'Home', href: '#/' },
              { label: 'Articles', href: '#/articles' },
              { label: 'Design System', isActive: true },
            ],
          }),
          code: `{Breadcrumb.view({
  items: [
    { label: 'Home', href: '#/' },
    { label: 'Articles', href: '#/articles' },
    { label: 'Design System', isActive: true }
  ]
})}`,
        }

      case 'menu':
        return {
          title: 'Menu',
          subtitle:
            'Sidebar navigation list with categories and active item states.',
          canvas: (
            <div className='w-full max-w-xs'>
              {Menu.view({
                categories: menuCategories,
                model: model.menuModel,
                dispatch: () => {},
              })}
            </div>
          ),
          code: `{Menu.view({
  categories: menuCategories,
  model: model.menuModel,
  dispatch: dispatch
})}`,
        }

      case 'message':
        return {
          title: 'Message',
          subtitle: 'Callout message boxes with optional header and body.',
          canvas: (
            <div className='w-full space-y-3'>
              {Message.view({
                variant: 'primary',
                header: 'Important Note',
                children:
                  'This design system is built with pure Tailwind CSS & React 19.',
              })}
              {Message.view({
                variant: 'danger',
                header: 'Error Encountered',
                children:
                  'Failed to synchronize form state with remote backend.',
              })}
            </div>
          ),
          code: `{Message.view({
  variant: 'primary',
  header: 'Important Note',
  children: 'Message body content...'
})}`,
        }

      case 'modal':
        return {
          title: 'Modal',
          subtitle:
            'Classic Bulma modal dialog overlay with header, body, and footer actions.',
          canvas: (
            <div>
              {Button.view({
                variant: 'primary',
                onClick: () =>
                  dispatch({ _tag: 'ModalMsg', subMsg: { _tag: 'Open' } }),
                children: 'Open Demo Modal',
              })}
              {Modal.view({
                title: 'Demo Modal',
                footer: (
                  <>
                    {Button.view({
                      variant: 'default',
                      onClick: () =>
                        dispatch({
                          _tag: 'ModalMsg',
                          subMsg: { _tag: 'Close' },
                        }),
                      children: 'Cancel',
                    })}
                    {Button.view({
                      variant: 'primary',
                      onClick: () =>
                        dispatch({
                          _tag: 'ModalMsg',
                          subMsg: { _tag: 'Close' },
                        }),
                      children: 'Save Changes',
                    })}
                  </>
                ),
                model: model.modalModel,
                dispatch: (subMsg: Modal.Msg) =>
                  dispatch({ _tag: 'ModalMsg', subMsg }),
                children: Content.view({
                  children:
                    'This is a pure TEA-architected Bulma modal dialog overlay!',
                }),
              })}
            </div>
          ),
          code: `{Modal.view({
  title: 'Demo Modal',
  model: model.modalModel,
  dispatch: dispatch,
  children: Content.view({ children: 'Modal Body Content' })
})}`,
        }

      case 'navbar':
        return {
          title: 'Navbar',
          subtitle:
            'Top navigation bar with brand, links, and action buttons.',
          canvas: (
            <div className='w-full'>
              {Navbar.view({
                brand: (
                  <span className='font-titillium text-2xl font-bold tracking-tight text-green-600'>
                    conduit
                  </span>
                ),
                startItems: [
                  { id: 'home', label: 'Home' },
                  { id: 'feed', label: 'Global Feed' },
                ],
                endItems: [
                  { id: 'new-post', label: 'New Article' },
                  { id: 'settings', label: 'Settings' },
                ],
                model: model.navbarModel,
                dispatch: () => {},
              })}
            </div>
          ),
          code: `{Navbar.view({
  brand: 'conduit',
  startItems: [{ id: 'home', label: 'Home' }],
  model: model.navbarModel,
  dispatch: dispatch
})}`,
        }

      case 'pagination':
        return {
          title: 'Pagination',
          subtitle:
            'Page navigation controls with prev/next and page numbers.',
          canvas: (
            <div className='w-full'>
              {Pagination.view({
                model: model.paginationModel,
                dispatch: (subMsg: Pagination.Msg) =>
                  dispatch({ _tag: 'PaginationMsg', subMsg }),
              })}
            </div>
          ),
          code: `{Pagination.view({
  model: model.paginationModel,
  dispatch: dispatch
})}`,
        }

      case 'panel':
        return {
          title: 'Panel',
          subtitle:
            'Bordered panel container with heading, search, and list items.',
          canvas: (
            <div className='w-full max-w-md'>
              {Panel.view({
                heading: 'Repositories',
                tabs: [
                  { id: 'all', label: 'All', isActive: true },
                  { id: 'public', label: 'Public' },
                  { id: 'private', label: 'Private' },
                ],
                blocks: [
                  {
                    id: 'p1',
                    label: 'realworld-fullstack-react-tea-cup-haskell',
                    isActive: true,
                  },
                  { id: 'p2', label: 'realworld-design-system' },
                  { id: 'p3', label: 'tea-cup-package' },
                ],
                model: model.panelModel,
                dispatch: () => {},
              })}
            </div>
          ),
          code: `{Panel.view({
  heading: 'Repositories',
  tabs: [{ id: 'all', label: 'All', isActive: true }],
  blocks: [{ id: 'p1', label: 'realworld-design-system' }],
  model: model.panelModel,
  dispatch: dispatch
})}`,
        }

      case 'tabs':
        return {
          title: 'Tabs',
          subtitle: 'Tabbed navigation bar with active state indicators.',
          canvas: (
            <div className='w-full space-y-4'>
              {Tabs.view({
                items: [
                  { id: 'feed', label: 'Your Feed' },
                  { id: 'global', label: 'Global Feed' },
                  { id: 'tag', label: '#react' },
                ],
                model: model.tabsModel,
                dispatch: (subMsg: Tabs.Msg) =>
                  dispatch({ _tag: 'TabsMsg', subMsg }),
              })}
            </div>
          ),
          code: `{Tabs.view({
  items: [
    { id: 'feed', label: 'Your Feed' },
    { id: 'global', label: 'Global Feed' }
  ],
  model: model.tabsModel,
  dispatch: dispatch
})}`,
        }

      case 'notification':
        return {
          title: 'Notification',
          subtitle: 'Bold notification banner boxes for user alerts.',
          canvas: (
            <div className='w-full space-y-3'>
              {Notification.view({
                variant: 'primary',
                onDelete: () => {},
                children: (
                  <>
                    <strong>Success!</strong> Your changes have been saved
                    successfully.
                  </>
                ),
              })}
              {Notification.view({
                variant: 'danger',
                onDelete: () => {},
                children: (
                  <>
                    <strong>Error!</strong> Could not connect to the backend
                    server.
                  </>
                ),
              })}
            </div>
          ),
          code: `{Notification.view({
  variant: 'primary',
  onDelete: handleDelete,
  children: 'Success! Your changes have been saved.'
})}`,
        }

      case 'progress':
        return {
          title: 'Progress',
          subtitle:
            'Standard Bulma progress bar and custom indeterminate extension.',
          canvas: (
            <div className='w-full max-w-md space-y-4'>
              <div>
                <p className='mb-1 text-xs font-semibold text-gray-500'>
                  Determinate Progress (60%)
                </p>
                {Progress.view({ value: 60, max: 100, variant: 'primary' })}
              </div>
              <div>
                <p className='mb-1 text-xs font-semibold text-gray-500'>
                  Indeterminate Progress Bar (Custom Non-Bulma Extension)
                </p>
                {Progress.view({ isIndeterminate: true, variant: 'link' })}
              </div>
            </div>
          ),
          code: `{Progress.view({ value: 60, max: 100, variant: 'primary' })}
{Progress.view({ isIndeterminate: true, variant: 'link' })}`,
        }

      case 'input':
      case 'field':
        return {
          title: 'Form Inputs & Fields',
          subtitle:
            'Stateless UI renderers designed for custom tea-cup-form rendering matching frontend-web.',
          canvas: (
            <div className='w-full max-w-md space-y-4'>
              {Field.view({
                label: 'Username',
                helpText: 'Enter your unique username',
                children: Input.view({
                  value: model.inputValue,
                  placeholder: 'e.g. alex',
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch({ _tag: 'UpdateInput', value: e.target.value }),
                }),
              })}

              {Field.view({
                label: 'Bio',
                children: Textarea.view({
                  value: model.textareaValue,
                  rows: 3,
                  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    dispatch({ _tag: 'UpdateTextarea', value: e.target.value }),
                }),
              })}

              {Field.view({
                label: 'Select Role',
                children: Select.view({
                  value: model.selectValue,
                  options: [
                    { label: 'Developer', value: 'option1' },
                    { label: 'Designer', value: 'option2' },
                    { label: 'Admin', value: 'option3' },
                  ],
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                    dispatch({ _tag: 'UpdateSelect', value: e.target.value }),
                }),
              })}

              {Checkbox.view({
                label: 'I accept the terms and conditions',
                checked: model.checkboxChecked,
                onChange: () => dispatch({ _tag: 'ToggleCheckbox' }),
              })}
            </div>
          ),
          code: `{Field.view({
  label: 'Username',
  helpText: 'Enter your unique username',
  children: Input.view({ value: model.inputValue, onChange: handleChange })
})}
{Checkbox.view({ label: 'Accept terms', checked: model.checkboxChecked })}`,
        }

      case 'textarea':
        return {
          title: 'Textarea',
          subtitle: 'Multi-line text input control.',
          canvas: (
            <div className='w-full max-w-md'>
              {Field.view({
                label: 'Article Body',
                children: Textarea.view({
                  value: model.textareaValue,
                  rows: 4,
                  placeholder: 'Write your article (in markdown)...',
                  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    dispatch({ _tag: 'UpdateTextarea', value: e.target.value }),
                }),
              })}
            </div>
          ),
          code: `{Textarea.view({ value: model.text, rows: 4, onChange: handleChange })}`,
        }

      case 'select':
        return {
          title: 'Select',
          subtitle: 'Custom dropdown selection input control.',
          canvas: (
            <div className='w-full max-w-md'>
              {Field.view({
                label: 'Category',
                children: Select.view({
                  value: model.selectValue,
                  options: [
                    { label: 'Technology', value: 'option1' },
                    { label: 'Design', value: 'option2' },
                    { label: 'Architecture', value: 'option3' },
                  ],
                  onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
                    dispatch({ _tag: 'UpdateSelect', value: e.target.value }),
                }),
              })}
            </div>
          ),
          code: `{Select.view({ value: model.val, options: [{ label: 'Tech', value: 'tech' }] })}`,
        }

      case 'checkbox':
        return {
          title: 'Checkbox',
          subtitle: 'Custom styled checkbox input control.',
          canvas: (
            <div className='space-y-2'>
              {Checkbox.view({
                label: 'Subscribe to newsletter updates',
                checked: model.checkboxChecked,
                onChange: () => dispatch({ _tag: 'ToggleCheckbox' }),
              })}
            </div>
          ),
          code: `{Checkbox.view({ label: 'Subscribe', checked: model.checked, onChange: toggle })}`,
        }

      case 'radio':
        return {
          title: 'Radio',
          subtitle: 'Radio button input for single-option selection.',
          canvas: (
            <div className='flex flex-col gap-2'>
              {Radio.view({
                name: 'role',
                value: 'author',
                label: 'Author Role',
                checked: true,
                onChange: () => {},
              })}
              {Radio.view({
                name: 'role',
                value: 'reader',
                label: 'Reader Role',
                checked: false,
                onChange: () => {},
              })}
            </div>
          ),
          code: `{Radio.view({ name: 'role', value: 'author', label: 'Author', checked: true })}`,
        }

      case 'file':
        return {
          title: 'File',
          subtitle: 'Styled file upload input element.',
          canvas: (
            <div className='w-full max-w-md'>
              {File.view({
                label: 'Choose Avatar Image...',
                hasName: true,
                fileName: 'profile-picture.png',
                onChange: () => {},
              })}
            </div>
          ),
          code: `{File.view({ label: 'Choose File...', hasName: true, fileName: 'avatar.png' })}`,
        }

      case 'container':
        return {
          title: 'Container',
          subtitle: 'Page width wrapper container (max-w-7xl).',
          canvas: Container.view({
            className:
              'w-full rounded border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm font-semibold text-gray-600',
            children: 'Container Content (Max-Width 1280px)',
          }),
          code: `{Container.view({ children: <p>Container Content</p> })}`,
        }

      case 'hero':
        return {
          title: 'Hero',
          subtitle: 'Large banner header for page top sections.',
          canvas: Hero.view({
            variant: 'primary',
            size: 'medium',
            className: 'w-full rounded-lg text-center shadow-sm',
            children: (
              <>
                {Title.view({
                  size: 1,
                  className: 'font-titillium font-bold text-white',
                  children: 'conduit',
                })}
                <p className='text-lg font-light text-white opacity-90'>
                  A place to share your knowledge.
                </p>
              </>
            ),
          }),
          code: `{Hero.view({
  variant: 'primary',
  children: (
    <>
      <Title size={1}>conduit</Title>
      <p>A place to share your knowledge.</p>
    </>
  )
})}`,
        }

      case 'section':
        return {
          title: 'Section',
          subtitle: 'Standard layout section with vertical padding.',
          canvas: Section.view({
            className: 'w-full rounded border border-gray-200 bg-gray-50 p-6',
            children: (
              <>
                {Title.view({ size: 4, children: 'Section Title' })}
                <p className='text-sm text-gray-600'>
                  This layout section adds consistent padding and spacing.
                </p>
              </>
            ),
          }),
          code: `{Section.view({ children: <Title size={4}>Section Title</Title> })}`,
        }

      case 'level':
        return {
          title: 'Level',
          subtitle: 'Horizontal layout container for multi-part items.',
          canvas: Level.view({
            className: 'w-full rounded border border-gray-200 bg-white p-4',
            left: (
              <div className='flex items-center gap-2'>
                {Tag.view({ variant: 'primary', children: 'conduit' })}
                <span className='text-sm font-semibold text-gray-800'>
                  Active Article
                </span>
              </div>
            ),
            right: (
              <div className='flex items-center gap-2'>
                {Button.view({
                  variant: 'primary',
                  size: 'small',
                  children: 'Edit',
                })}
                {Button.view({
                  variant: 'danger',
                  size: 'small',
                  children: 'Delete',
                })}
              </div>
            ),
          }),
          code: `{Level.view({
  left: <span>Active Article</span>,
  right: Button.view({ size: 'small', children: 'Edit' })
})}`,
        }

      case 'media-object':
        return {
          title: 'Media Object',
          subtitle:
            'Comment / post item with avatar on left and text on right.',
          canvas: (
            <div className='w-full'>
              {MediaObject.view({
                left: Image.view({
                  src: 'https://api.realworld.io/images/demo-avatar.png',
                  size: '48x48',
                  isRounded: true,
                }),
                children: (
                  <>
                    <div className='mb-1 flex items-center justify-between'>
                      <span className='text-sm font-semibold text-gray-900'>
                        Jacob Schatz
                      </span>
                      <span className='text-xs text-gray-400'>Feb 18, 2026</span>
                    </div>
                    <p className='text-sm text-gray-600'>
                      With RealWorld and React TEA, state management becomes
                      completely deterministic!
                    </p>
                  </>
                ),
              })}
            </div>
          ),
          code: `{MediaObject.view({
  left: Image.view({ src: '...', size: '48x48', isRounded: true }),
  children: <p>Comment content...</p>
})}`,
        }

      case 'footer':
        return {
          title: 'Footer',
          subtitle: 'Page footer container for copyright and links.',
          canvas: <div className='w-full'>{Footer.view({})}</div>,
          code: `{Footer.view({})}`,
        }

      case 'columns':
        return {
          title: 'Columns & Column',
          subtitle: 'Flexbox multi-column grid layout system.',
          canvas: (
            <div className='w-full space-y-4'>
              {Columns.view({
                children: (
                  <>
                    {Column.view({
                      size: 'one-half',
                      children: (
                        <div className='rounded border border-gray-200 bg-gray-50 p-4 text-center text-sm font-semibold text-gray-700'>
                          Column 1/2
                        </div>
                      ),
                    })}
                    {Column.view({
                      size: 'one-half',
                      children: (
                        <div className='rounded border border-gray-200 bg-gray-50 p-4 text-center text-sm font-semibold text-gray-700'>
                          Column 1/2
                        </div>
                      ),
                    })}
                  </>
                ),
              })}
              {Columns.view({
                children: (
                  <>
                    {Column.view({
                      size: 'one-quarter',
                      children: (
                        <div className='rounded border border-gray-200 bg-gray-50 p-4 text-center text-sm font-semibold text-gray-700'>
                          Column 1/4
                        </div>
                      ),
                    })}
                    {Column.view({
                      size: 'three-quarters',
                      children: (
                        <div className='rounded border border-gray-200 bg-gray-50 p-4 text-center text-sm font-semibold text-gray-700'>
                          Column 3/4
                        </div>
                      ),
                    })}
                  </>
                ),
              })}
            </div>
          ),
          code: `{Columns.view({
  children: (
    <>
      {Column.view({ size: 'one-half', children: <div>1/2</div> })}
      {Column.view({ size: 'one-half', children: <div>1/2</div> })}
    </>
  )
})}`,
        }

      default:
        return {
          title: model.activeComponent.toUpperCase(),
          subtitle: `Bulma-inspired ${model.activeComponent} design system element.`,
          canvas: Box.view({
            children: (
              <>
                {Title.view({
                  size: 5,
                  className: 'mb-1 text-gray-900',
                  children: 'Live Component Showcase',
                })}
                {Content.view({
                  size: 'normal',
                  className: 'text-gray-600',
                  children: `Displaying preview for ${model.activeComponent} component.`,
                })}
              </>
            ),
          }),
          code: `{${model.activeComponent}.view({})}`,
        }
    }
  }

  const currentPreview = renderComponentPreview()

  return (
    <div className='flex min-h-screen flex-col bg-white font-sans text-gray-900'>
      {/* Top Navbar Header */}
      {Navbar.view({
        brand: (
          <span className='font-titillium text-2xl font-bold tracking-tight text-green-600'>
            conduit
          </span>
        ),
        startItems: [{ id: 'design-system', label: 'Design System Showcase' }],
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
                  className: 'p-4 w-full',
                  children: Menu.view({
                    categories: menuCategories,
                    model: model.menuModel,
                    dispatch: (subMsg: Menu.Msg) => {
                      if (subMsg._tag === 'Select') {
                        const compId = subMsg.id as ComponentItem
                        let foundCat: SectionCategory = 'elements'
                        for (const cat of categories) {
                          if (cat.items.some((i) => i.id === compId)) {
                            foundCat = cat.id
                            break
                          }
                        }
                        dispatch({ _tag: 'SelectCategory', category: foundCat })
                        dispatch({
                          _tag: 'SelectComponent',
                          component: compId,
                        })
                      }
                    },
                  }),
                }),
              })}

              {/* Main Content Area */}
              {Column.view({
                size: 'three-quarters',
                children: (
                  <div className='w-full'>
                    {/* Header Hero Banner */}
                    {Hero.view({
                      variant: 'default',
                      size: 'small',
                      className:
                        'mb-6 rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
                      children: (
                        <>
                          <div className='mb-1 text-xs font-bold uppercase tracking-wider text-green-600'>
                            CSS LIBRARY / {model.activeCategory.toUpperCase()}
                          </div>
                          {Title.view({
                            size: 2,
                            className: 'mb-2 font-extrabold text-gray-900',
                            children: currentPreview.title,
                          })}
                          <p className='text-base text-gray-600'>
                            {currentPreview.subtitle}
                          </p>
                        </>
                      ),
                    })}

                    {/* Canvas Preview & Code Block Section */}
                    <div className='flex flex-col gap-6 w-full'>
                      <div className='flex items-center justify-between w-full'>
                        {Title.view({
                          size: 5,
                          className:
                            'flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600',
                          children: (
                            <>
                              <Sparkles className='h-4 w-4 text-green-600' />
                              <span>Interactive Playground &amp; Code</span>
                            </>
                          ),
                        })}
                        {Button.view({
                          variant: 'link',
                          size: 'small',
                          onClick: () => dispatch({ _tag: 'ToggleShowCode' }),
                          className:
                            'flex items-center gap-1 font-semibold text-green-600 hover:underline',
                          children: (
                            <>
                              <Code2 className='h-3.5 w-3.5' />
                              <span>
                                {model.showCode ? 'Hide Code' : 'Show Code'}
                              </span>
                            </>
                          ),
                        })}
                      </div>

                      {/* Canvas Preview Box */}
                      {Box.view({
                        className:
                          'flex min-h-[220px] w-full items-center justify-center p-6',
                        children: (
                          <div className='flex w-full items-center justify-center'>
                            {currentPreview.canvas}
                          </div>
                        ),
                      })}

                      {/* Code Snippet Block */}
                      {model.showCode && (
                        <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
                          <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
                            <span className='font-semibold text-green-400'>
                              JSX / HTML
                            </span>
                            <span className='text-gray-500'>
                              Component Code
                            </span>
                          </div>
                          <pre className='whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-300'>
                            <code>{currentPreview.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ),
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
