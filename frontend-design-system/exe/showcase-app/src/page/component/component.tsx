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
  Table,
  Tabs,
  Tag,
  Textarea,
  Title,
} from '@rinn7e/realworld-design-system'
import { BookOpen, Code2, Layers, Search, Sparkles } from 'lucide-react'
import type { Dispatcher } from 'tea-cup-fp'

import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const ComponentViewPage: React.FC<Props> = ({ model, dispatch }) => {
  const renderPreview = () => {
    switch (model.component) {
      case 'button':
        return {
          category: 'ELEMENTS',
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
          category: 'ELEMENTS',
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
          category: 'ELEMENTS',
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
          category: 'ELEMENTS',
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
          category: 'ELEMENTS',
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
          category: 'ELEMENTS',
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
          category: 'ELEMENTS',
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
                  ratio: 'rounded',
                  alt: 'User avatar',
                })}
                <span className='text-sm font-semibold text-gray-800'>
                  Eric Simons (Author)
                </span>
              </div>
            </div>
          ),
          code: `{Image.view({ src: '...', ratio: '16by9' })}
{Image.view({ src: '...', size: '48x48', ratio: 'rounded' })}`,
        }

      case 'table':
        return {
          category: 'ELEMENTS',
          title: 'Table',
          subtitle: 'Styled data table for tabular information display.',
          canvas: (
            <div className='w-full overflow-x-auto'>
              {Table.view({
                isBordered: true,
                isStriped: true,
                isHoverable: true,
                isFullWidth: true,
                children: (
                  <>
                    <thead>
                      <tr>
                        <th className='p-3 text-left font-semibold text-gray-700'>Article Title</th>
                        <th className='p-3 text-left font-semibold text-gray-700'>Author</th>
                        <th className='p-3 text-left font-semibold text-gray-700'>Favorites</th>
                        <th className='p-3 text-left font-semibold text-gray-700'>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='border-t border-gray-200'>
                        <td className='p-3 text-gray-900'>Create a design system in TypeScript</td>
                        <td className='p-3 text-gray-600'>Eric Simons</td>
                        <td className='p-3 text-gray-600'>1,420</td>
                        <td className='p-3 text-gray-500'>Jan 20, 2026</td>
                      </tr>
                      <tr className='border-t border-gray-200 bg-gray-50'>
                        <td className='p-3 text-gray-900'>Explore Elm Architecture with React TEA</td>
                        <td className='p-3 text-gray-600'>Albert Pai</td>
                        <td className='p-3 text-gray-600'>980</td>
                        <td className='p-3 text-gray-500'>Jan 18, 2026</td>
                      </tr>
                      <tr className='border-t border-gray-200'>
                        <td className='p-3 text-gray-900'>Building Fullstack Applications</td>
                        <td className='p-3 text-gray-600'>Rinn7e</td>
                        <td className='p-3 text-gray-600'>2,150</td>
                        <td className='p-3 text-gray-500'>Jan 15, 2026</td>
                      </tr>
                    </tbody>
                  </>
                ),
              })}
            </div>
          ),
          code: `{Table.view({
  isBordered: true,
  isStriped: true,
  children: (
    <>
      <thead><tr><th>Title</th><th>Author</th></tr></thead>
      <tbody><tr><td>Article 1</td><td>Eric</td></tr></tbody>
    </>
  )
})}`,
        }

      case 'title':
        return {
          category: 'ELEMENTS',
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
          category: 'COMPONENTS',
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
          category: 'ELEMENTS',
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
          category: 'COMPONENTS',
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
          category: 'COMPONENTS',
          title: 'Breadcrumb',
          subtitle: 'Horizontal breadcrumb navigation for multi-level paths.',
          canvas: Breadcrumb.view({
            items: [
              { label: 'Home', href: '/' },
              { label: 'Articles', href: '/' },
              { label: 'Design System', isActive: true },
            ],
          }),
          code: `{Breadcrumb.view({
  items: [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/' },
    { label: 'Design System', isActive: true }
  ]
})}`,
        }

      case 'menu':
        return {
          category: 'COMPONENTS',
          title: 'Menu',
          subtitle:
            'Sidebar navigation list with categories and active item states.',
          canvas: (
            <div className='w-full max-w-xs'>
              {Menu.view({
                categories: [
                  {
                    title: 'General',
                    items: [
                      { id: 'dashboard', label: 'Dashboard', isActive: true },
                      { id: 'customers', label: 'Customers' },
                    ],
                  },
                ],
                model: model.menuModel,
                dispatch: (subMsg: Menu.Msg) =>
                  dispatch({ _tag: 'MenuMsg', subMsg }),
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
          category: 'COMPONENTS',
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
          category: 'COMPONENTS',
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
          category: 'COMPONENTS',
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
                dispatch: (subMsg: Navbar.Msg) =>
                  dispatch({ _tag: 'NavbarMsg', subMsg }),
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
          category: 'COMPONENTS',
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
          category: 'COMPONENTS',
          title: 'Panel',
          subtitle:
            'Bordered panel container with heading, search, and list items.',
          canvas: (
            <div className='w-full max-w-md'>
              {Panel.view({
                heading: 'Repositories',
                tabs: [
                  { id: 'all', label: 'All' },
                  { id: 'public', label: 'Public' },
                  { id: 'private', label: 'Private' },
                ],
                blocks: [
                  {
                    id: 'p1',
                    label: 'realworld-fullstack-react-tea-cup-haskell',
                  },
                  { id: 'p2', label: 'realworld-design-system' },
                  { id: 'p3', label: 'tea-cup-package' },
                ],
                model: model.panelModel,
                dispatch: (subMsg: Panel.Msg) =>
                  dispatch({ _tag: 'PanelMsg', subMsg }),
              })}
            </div>
          ),
          code: `{Panel.view({
  heading: 'Repositories',
  tabs: [{ id: 'all', label: 'All' }],
  blocks: [{ id: 'p1', label: 'realworld-design-system' }],
  model: model.panelModel,
  dispatch: dispatch
})}`,
        }

      case 'tabs':
        return {
          category: 'COMPONENTS',
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
          category: 'ELEMENTS',
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
          category: 'ELEMENTS',
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
          category: 'FORM',
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
          category: 'FORM',
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
          category: 'FORM',
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
          category: 'FORM',
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
          category: 'FORM',
          title: 'Radio',
          subtitle: 'Radio button input for single-option selection.',
          canvas: (
            <div className='flex flex-col gap-2'>
              {Radio.view({
                name: 'role',
                options: [
                  { label: 'Author Role', value: 'author' },
                  { label: 'Reader Role', value: 'reader' },
                ],
                selectedValue: 'author',
                onChange: () => {},
              })}
            </div>
          ),
          code: `{Radio.view({ name: 'role', options: [{ label: 'Author', value: 'author' }], selectedValue: 'author' })}`,
        }

      case 'file':
        return {
          category: 'FORM',
          title: 'File',
          subtitle: 'Styled file upload input element.',
          canvas: (
            <div className='w-full max-w-md'>
              {File.view({
                ctaText: 'Choose Avatar Image...',
                filename: 'profile-picture.png',
                onChange: () => {},
              })}
            </div>
          ),
          code: `{File.view({ ctaText: 'Choose File...', filename: 'avatar.png' })}`,
        }

      case 'container':
        return {
          category: 'LAYOUT',
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
          category: 'LAYOUT',
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
          category: 'LAYOUT',
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
          category: 'LAYOUT',
          title: 'Level',
          subtitle: 'Horizontal layout container for multi-part items.',
          canvas: Level.view({
            className: 'w-full rounded border border-gray-200 bg-white p-4',
            children: (
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-2'>
                  {Tag.view({ variant: 'primary', children: 'conduit' })}
                  <span className='text-sm font-semibold text-gray-800'>
                    Active Article
                  </span>
                </div>
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
              </div>
            ),
          }),
          code: `{Level.view({
  children: (
    <div className='flex justify-between'>
      <span>Active Article</span>
      {Button.view({ size: 'small', children: 'Edit' })}
    </div>
  )
})}`,
        }

      case 'media-object':
        return {
          category: 'LAYOUT',
          title: 'Media Object',
          subtitle:
            'Comment / post item with avatar on left and text on right.',
          canvas: (
            <div className='w-full'>
              {MediaObject.view({
                left: Image.view({
                  src: 'https://api.realworld.io/images/demo-avatar.png',
                  size: '48x48',
                  ratio: 'rounded',
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
  left: Image.view({ src: '...', size: '48x48', ratio: 'rounded' }),
  children: <p>Comment content...</p>
})}`,
        }

      case 'footer':
        return {
          category: 'LAYOUT',
          title: 'Footer',
          subtitle: 'Page footer container for copyright and links.',
          canvas: <div className='w-full'>{Footer.view({})}</div>,
          code: `{Footer.view({})}`,
        }

      case 'columns':
        return {
          category: 'GRID',
          title: 'Columns & Column',
          subtitle: 'Flexbox multi-column grid layout system.',
          canvas: (
            <div className='w-full space-y-4'>
              {Columns.view({
                children: (
                  <>
                    {Column.view({
                      size: 'half',
                      children: (
                        <div className='rounded border border-gray-200 bg-gray-50 p-4 text-center text-sm font-semibold text-gray-700'>
                          Column 1/2
                        </div>
                      ),
                    })}
                    {Column.view({
                      size: 'half',
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
      {Column.view({ size: 'half', children: <div>1/2</div> })}
      {Column.view({ size: 'half', children: <div>1/2</div> })}
    </>
  )
})}`,
        }

      default:
        return {
          category: 'DESIGN SYSTEM',
          title: String(model.component).toUpperCase(),
          subtitle: `Bulma-inspired ${model.component} design system element.`,
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
                  children: `Displaying preview for ${model.component} component.`,
                })}
              </>
            ),
          }),
          code: `{${model.component}.view({})}`,
        }
    }
  }

  const preview = renderPreview()

  return (
    <div className='w-full text-left'>
      {/* Header Hero Banner */}
      {Hero.view({
        variant: 'default',
        size: 'small',
        className:
          'mb-6 rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: (
          <>
            <div className='mb-1 text-xs font-bold uppercase tracking-wider text-green-600'>
              {preview.category} / {model.component.toUpperCase()}
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: preview.title,
            })}
            <p className='text-base text-gray-600'>{preview.subtitle}</p>
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
                <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
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
              {preview.canvas}
            </div>
          ),
        })}

        {/* Code Snippet Block */}
        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Component Code</span>
            </div>
            <pre className='whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-300'>
              <code>{preview.code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
