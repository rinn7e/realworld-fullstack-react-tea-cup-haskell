import React from 'react'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Dropdown,
  Field,
  Footer,
  Image,
  Input,
  Modal,
  Notification,
  Progress,
  Select,
  Tag,
  Textarea,
} from '@rinn7e/frontend-design-system'
import {
  BookOpen,
  ChevronRight,
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
      icon: <Layers className='h-4 w-4 text-emerald-500' />,
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
      icon: <Sparkles className='h-4 w-4 text-indigo-500' />,
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
      icon: <BookOpen className='h-4 w-4 text-sky-500' />,
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
      icon: <LayoutGrid className='h-4 w-4 text-amber-500' />,
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
      icon: <LayoutGrid className='h-4 w-4 text-rose-500' />,
      items: [{ id: 'columns', name: 'Columns' }],
    },
  ]

  const renderComponentPreview = () => {
    switch (model.activeComponent) {
      case 'button':
        return {
          title: 'Button',
          subtitle:
            'The classic Bulma button element in different colors, sizes, and states.',
          canvas: (
            <div className='flex flex-wrap items-center gap-3'>
              <Button.view variant='default'>Default</Button.view>
              <Button.view variant='primary'>Primary</Button.view>
              <Button.view variant='link'>Link</Button.view>
              <Button.view variant='info'>Info</Button.view>
              <Button.view variant='success'>Success</Button.view>
              <Button.view variant='warning'>Warning</Button.view>
              <Button.view variant='danger'>Danger</Button.view>
              <Button.view variant='primary' isOutlined>
                Outlined
              </Button.view>
              <Button.view variant='primary' isRounded>
                Rounded
              </Button.view>
              <Button.view variant='primary' isLoading>
                Loading
              </Button.view>
            </div>
          ),
          code: `<Button.view variant="primary">Primary</Button.view>
<Button.view variant="info" isOutlined>Outlined</Button.view>
<Button.view variant="success" isRounded>Rounded</Button.view>
<Button.view variant="danger" isLoading>Loading</Button.view>`,
        }

      case 'box':
        return {
          title: 'Box',
          subtitle:
            'A white container box with border shadow to group content.',
          canvas: (
            <Box.view>
              <h4 className='mb-1 font-bold text-gray-900'>
                Interactive Box Container
              </h4>
              <p className='text-sm text-gray-600'>
                This is a classic Bulma-styled box container wrapped in pure
                Tailwind CSS styles.
              </p>
            </Box.view>
          ),
          code: `<Box.view>
  <h4 className="font-bold text-gray-900 mb-1">Interactive Box Container</h4>
  <p className="text-sm text-gray-600">This is a classic Bulma-styled box container.</p>
</Box.view>`,
        }

      case 'card':
        return {
          title: 'Card',
          subtitle:
            'A flexible and extensible content container with header, image, body, and footer.',
          canvas: (
            <div className='max-w-sm'>
              <Card.view
                header='John Smith'
                image={
                  <Image.view
                    src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                    ratio='16by9'
                  />
                }
                footer={
                  <div className='flex w-full items-center justify-between'>
                    <span>Posted 2 days ago</span>
                    <Button.view size='small' variant='link'>
                      Read More
                    </Button.view>
                  </div>
                }
              >
                <p className='text-sm text-gray-600'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus nec iaculis mauris.
                </p>
              </Card.view>
            </div>
          ),
          code: `<Card.view
  header="John Smith"
  image={<Image.view src="..." ratio="16by9" />}
  footer={<Button.view size="small">Read More</Button.view>}
>
  <p>Lorem ipsum dolor sit amet...</p>
</Card.view>`,
        }

      case 'tag':
        return {
          title: 'Tag',
          subtitle:
            'Small tag badges for labels, categories, and keyword filters.',
          canvas: (
            <div className='flex flex-wrap items-center gap-2'>
              <Tag.view variant='default'>Default</Tag.view>
              <Tag.view variant='primary'>Primary</Tag.view>
              <Tag.view variant='link'>Link</Tag.view>
              <Tag.view variant='info' isRounded>
                Info Rounded
              </Tag.view>
              <Tag.view variant='success' isLight>
                Success Light
              </Tag.view>
              <Tag.view variant='warning'>Warning</Tag.view>
              <Tag.view variant='danger' onDelete={() => alert('Deleted tag!')}>
                With Delete
              </Tag.view>
            </div>
          ),
          code: `<Tag.view variant="primary">Primary</Tag.view>
<Tag.view variant="info" isRounded>Info Rounded</Tag.view>
<Tag.view variant="danger" onDelete={handleDelete}>With Delete</Tag.view>`,
        }

      case 'dropdown':
        return {
          title: 'Dropdown',
          subtitle:
            'Interactive dropdown menu component with TEA state handling.',
          canvas: (
            <Dropdown.view
              triggerLabel='Select Option'
              items={[
                { id: 'opt1', label: 'Option 1' },
                { id: 'opt2', label: 'Option 2' },
                { id: 'div1', label: '', isDivider: true },
                { id: 'opt3', label: 'Settings' },
              ]}
              model={model.dropdownModel}
              dispatch={(subMsg: Dropdown.Msg) =>
                dispatch({ _tag: 'DropdownMsg', subMsg })
              }
            />
          ),
          code: `<Dropdown.view
  triggerLabel="Select Option"
  items={[
    { id: 'opt1', label: 'Option 1' },
    { id: 'opt2', label: 'Option 2' }
  ]}
  model={model.dropdownModel}
  dispatch={dispatch}
/>`,
        }

      case 'modal':
        return {
          title: 'Modal',
          subtitle:
            'Classic Bulma modal dialog overlay with header, body, and footer actions.',
          canvas: (
            <div>
              <Button.view
                variant='primary'
                onClick={() =>
                  dispatch({ _tag: 'ModalMsg', subMsg: { _tag: 'Open' } })
                }
              >
                Open Demo Modal
              </Button.view>
              <Modal.view
                title='Demo Modal'
                footer={
                  <>
                    <Button.view
                      variant='default'
                      onClick={() =>
                        dispatch({
                          _tag: 'ModalMsg',
                          subMsg: { _tag: 'Close' },
                        })
                      }
                    >
                      Cancel
                    </Button.view>
                    <Button.view
                      variant='primary'
                      onClick={() =>
                        dispatch({
                          _tag: 'ModalMsg',
                          subMsg: { _tag: 'Close' },
                        })
                      }
                    >
                      Save Changes
                    </Button.view>
                  </>
                }
                model={model.modalModel}
                dispatch={(subMsg: Modal.Msg) =>
                  dispatch({ _tag: 'ModalMsg', subMsg })
                }
              >
                <p>
                  This is a pure TEA-architected Bulma modal dialog overlay!
                </p>
              </Modal.view>
            </div>
          ),
          code: `<Modal.view
  title="Demo Modal"
  model={model.modalModel}
  dispatch={dispatch}
>
  <p>Modal Body Content</p>
</Modal.view>`,
        }

      case 'notification':
        return {
          title: 'Notification',
          subtitle: 'Bold notification banner boxes for user alerts.',
          canvas: (
            <div className='w-full max-w-lg space-y-3'>
              <Notification.view variant='primary' onDelete={() => {}}>
                <strong>Success!</strong> Your changes have been saved
                successfully.
              </Notification.view>
              <Notification.view variant='danger' onDelete={() => {}}>
                <strong>Error!</strong> Could not connect to the backend server.
              </Notification.view>
            </div>
          ),
          code: `<Notification.view variant="primary" onDelete={handleDelete}>
  <strong>Success!</strong> Your changes have been saved.
</Notification.view>`,
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
                <Progress.view value={60} max={100} variant='primary' />
              </div>
              <div>
                <p className='mb-1 text-xs font-semibold text-gray-500'>
                  Indeterminate Progress Bar (Custom Non-Bulma Extension)
                </p>
                <Progress.view isIndeterminate variant='link' />
              </div>
            </div>
          ),
          code: `<!-- Standard Determinate Progress -->
<Progress.view value={60} max={100} variant="primary" />

<!-- Custom Non-Bulma Extension: Indeterminate Progress Bar -->
<Progress.view isIndeterminate variant="link" />`,
        }

      case 'input':
      case 'field':
        return {
          title: 'Form Inputs & Fields',
          subtitle:
            'Stateless UI renderers designed for custom tea-cup-form rendering.',
          canvas: (
            <div className='w-full max-w-md space-y-4'>
              <Field.view label='Username' helpText='Enter your unique username'>
                <Input.view
                  value={model.inputValue}
                  placeholder='e.g. alex'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch({ _tag: 'UpdateInput', value: e.target.value })
                  }
                />
              </Field.view>

              <Field.view label='Bio'>
                <Textarea.view
                  value={model.textareaValue}
                  rows={3}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    dispatch({ _tag: 'UpdateTextarea', value: e.target.value })
                  }
                />
              </Field.view>

              <Field.view label='Select Role'>
                <Select.view
                  value={model.selectValue}
                  options={[
                    { label: 'Developer', value: 'option1' },
                    { label: 'Designer', value: 'option2' },
                    { label: 'Admin', value: 'option3' },
                  ]}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    dispatch({ _tag: 'UpdateSelect', value: e.target.value })
                  }
                />
              </Field.view>

              <Checkbox.view
                label='I accept the terms and conditions'
                checked={model.checkboxChecked}
                onChange={() => dispatch({ _tag: 'ToggleCheckbox' })}
              />
            </div>
          ),
          code: `<Field.view label="Username" helpText="Enter your unique username">
  <Input.view value={model.inputValue} onChange={handleChange} />
</Field.view>
<Checkbox.view label="Accept terms" checked={model.checkboxChecked} />`,
        }

      default:
        return {
          title: model.activeComponent.toUpperCase(),
          subtitle: `Bulma-inspired ${model.activeComponent} design system element.`,
          canvas: (
            <div className='rounded-lg border bg-gray-50 p-6 text-sm text-gray-600'>
              <p className='mb-1 font-semibold text-gray-900'>
                Live Component Showcase
              </p>
              <p>
                Displaying preview for <code>{model.activeComponent}</code>{' '}
                component.
              </p>
            </div>
          ),
          code: `<${model.activeComponent}.view />`,
        }
    }
  }

  const currentPreview = renderComponentPreview()

  return (
    <div className='flex min-h-screen flex-col bg-gray-50 font-sans'>
      {/* Top Navbar Header */}
      <header className='sticky top-0 z-40 border-b border-gray-200 bg-white shadow-2xs'>
        <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-xl font-black text-white shadow-xs'>
              B
            </div>
            <div>
              <h1 className='text-base font-bold leading-tight text-gray-900'>
                Bulma Design System
              </h1>
              <p className='text-xs font-medium text-gray-500'>
                Tailwind CSS Components & TEA UI Renderers
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <div className='relative hidden sm:block'>
              <Search className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search components…'
                value={model.searchQuery}
                onChange={(e) =>
                  dispatch({ _tag: 'UpdateSearch', query: e.target.value })
                }
                className='w-56 rounded-full border border-transparent bg-gray-100 py-1.5 pr-4 pl-9 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none'
              />
            </div>
            <a
              href='https://github.com'
              target='_blank'
              rel='noreferrer'
              className='rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900'
            >
              <Code2 className='h-5 w-5' />
            </a>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className='mx-auto flex w-full max-w-7xl flex-1'>
        {/* Left Sidebar Navigation (Matching Bulma Docs) */}
        <aside className='hidden max-h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4 md:block'>
          <div className='space-y-6'>
            {categories.map((cat) => (
              <div key={cat.id}>
                <div className='mb-2 flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wider text-gray-400'>
                  {cat.icon}
                  <span>{cat.title}</span>
                </div>
                <ul className='space-y-0.5'>
                  {cat.items.map((item) => {
                    const isSelected = model.activeComponent === item.id
                    return (
                      <li key={item.id}>
                        <button
                          type='button'
                          onClick={() => {
                            dispatch({
                              _tag: 'SelectCategory',
                              category: cat.id,
                            })
                            dispatch({
                              _tag: 'SelectComponent',
                              component: item.id,
                            })
                          }}
                          className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-emerald-50 font-bold text-emerald-600'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <span>{item.name}</span>
                          {isSelected && (
                            <ChevronRight className='h-4 w-4 text-emerald-500' />
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Showcase View */}
        <main className='max-w-5xl flex-1 overflow-y-auto p-6 md:p-8'>
          {/* Header Title Section */}
          <div className='mb-8 border-b border-gray-200 pb-6'>
            <div className='mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600'>
              <span>CSS Library</span>
              <span>/</span>
              <span className='capitalize'>{model.activeCategory}</span>
            </div>
            <h2 className='mb-2 text-3xl font-extrabold tracking-tight text-gray-900'>
              {currentPreview.title}
            </h2>
            <p className='max-w-2xl text-base text-gray-600'>
              {currentPreview.subtitle}
            </p>
          </div>

          {/* Canvas Preview Side-by-Side Code Block (Matching Screenshot) */}
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500'>
                <Sparkles className='h-4 w-4 text-emerald-500' />
                <span>Interactive Playground & Code</span>
              </h3>
              <button
                type='button'
                onClick={() => dispatch({ _tag: 'ToggleShowCode' })}
                aria-label='Toggle Code'
                className='flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline'
              >
                <Code2 className='h-3.5 w-3.5' />
                <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
              </button>
            </div>

            <div className='grid grid-cols-1 items-start gap-6 lg:grid-cols-2'>
              {/* Canvas Preview Box */}
              <div className='flex min-h-[320px] items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-xs'>
                <div className='flex w-full items-center justify-center'>
                  {currentPreview.canvas}
                </div>
              </div>

              {/* Code Snippet Block (Matching Screenshot Code Panel) */}
              {model.showCode && (
                <div className='relative min-h-[320px] overflow-x-auto rounded-xl border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
                  <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
                    <span className='font-semibold text-emerald-400'>
                      JSX / HTML
                    </span>
                    <span className='text-gray-500'>Component Code</span>
                  </div>
                  <pre className='leading-relaxed text-gray-300'>
                    <code>{currentPreview.code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer.view />
    </div>
  )
}
