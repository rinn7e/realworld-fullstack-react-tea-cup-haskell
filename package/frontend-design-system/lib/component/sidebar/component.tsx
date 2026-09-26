import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  User as UserIcon,
} from 'lucide-react'
import { memo } from 'react'

import { ButtonMemo as DsButtonMemo } from '../../element/button/component'
import { cn } from '../../theme'
import { GenericLink } from '../generic-link/component'
import {
  type SidebarCategory,
  type SidebarItemProps,
  SidebarItemPropsEq,
  type SidebarProps,
  SidebarPropsEq,
} from './type'

const activeCls =
  'bg-green-50 text-green-600 font-semibold dark:bg-green-950/40 dark:text-green-400'
const inactiveCls =
  'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'

const SidebarItemComponent = ({
  item,
  depth,
  isCollapsed,
  expandedKeys,
  dispatch,
}: SidebarItemProps) => {
  const children = item.children ?? []
  const hasChildren = children.length > 0
  const isExpanded = expandedKeys.includes(item.key)

  const itemCls = cn(
    'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors cursor-pointer select-none text-left',
    item.isActive ? activeCls : inactiveCls,
    isCollapsed && 'justify-center px-0',
    depth > 0 && !isCollapsed && 'pl-7 text-xs',
  )

  const navContent = (
    <>
      <div className='flex items-center gap-3 truncate'>
        <span className='shrink-0'>{item.icon}</span>
        {!isCollapsed && <span className='truncate'>{item.label}</span>}
      </div>

      {hasChildren && !isCollapsed && (
        <span className='shrink-0 text-gray-400 dark:text-slate-500'>
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      )}
    </>
  )

  return (
    <li className='flex flex-col gap-1'>
      {hasChildren ? (
        <button
          type='button'
          className={itemCls}
          onClick={() => dispatch({ _tag: 'ClickItem', item })}
          data-test='nav-link'
          aria-current={item.isActive ? 'page' : undefined}
        >
          {navContent}
        </button>
      ) : (
        <GenericLink
          className={itemCls}
          href={item.href ?? '#'}
          dispatch={dispatch}
          msg={item.isNewTab ? undefined : { _tag: 'ClickItem', item }}
          isNewTab={item.isNewTab}
          data-test='nav-link'
          aria-current={item.isActive ? 'page' : undefined}
        >
          {navContent}
        </GenericLink>
      )}

      {hasChildren && isExpanded && !isCollapsed && (
        <div className='pl-3'>
          <ul className='flex flex-col gap-1 border-l border-gray-100 pl-2 dark:border-slate-800'>
            {children.map((child) => (
              <SidebarItemMemo
                key={child.key}
                item={child}
                depth={depth + 1}
                isCollapsed={isCollapsed}
                expandedKeys={expandedKeys}
                dispatch={dispatch}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

const SidebarItemMemo = memo(SidebarItemComponent, SidebarItemPropsEq.equals)

const SidebarComponent = ({
  model,
  items,
  categories,
  dispatch,
  brandTitle = 'conduit',
  brandLogo,
  userProfile,
  align = 'left',
  className,
  dataTest = 'sidebar',
}: SidebarProps) => {
  const isCollapsed = model.collapsed

  const normalizedCategories: SidebarCategory[] = categories
    ? categories
    : items
      ? [{ title: '', items }]
      : []

  return (
    <aside
      data-test={dataTest}
      data-component='Sidebar'
      className={cn(
        'flex h-full shrink-0 flex-col overflow-hidden bg-white transition-all duration-300 ease-in-out select-none dark:bg-slate-900',
        align === 'right'
          ? 'border-l border-gray-200 dark:border-slate-800'
          : 'border-r border-gray-200 dark:border-slate-800',
        isCollapsed ? 'w-[64px]' : 'w-[240px]',
        className,
      )}
    >
      {/* Header / Brand */}
      <div
        className={cn(
          'flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-3 dark:border-slate-800',
          align === 'right' && 'flex-row-reverse',
        )}
      >
        {!isCollapsed ? (
          <div className='flex items-center gap-2 truncate overflow-hidden'>
            {brandLogo}
            <span className='truncate text-lg font-bold text-green-600 dark:text-green-400'>
              {brandTitle}
            </span>
          </div>
        ) : (
          brandLogo && <div className='mx-auto'>{brandLogo}</div>
        )}
        <DsButtonMemo
          color='gray'
          variant='ghost'
          size='small'
          onClick={() => dispatch({ _tag: 'ToggleCollapsed' })}
          className={cn(
            'p-1 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200',
            isCollapsed && 'mx-auto',
          )}
        >
          {align === 'right' ? (
            isCollapsed ? (
              <PanelRightOpen size={20} />
            ) : (
              <PanelRightClose size={20} />
            )
          ) : isCollapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </DsButtonMemo>
      </div>

      {/* Nav List */}
      <div className='flex flex-1 flex-col gap-3 overflow-y-auto p-2'>
        {normalizedCategories.map((cat, idx) => (
          <div key={cat.title || idx} className='flex flex-col gap-1'>
            {cat.title && (
              <>
                {!isCollapsed ? (
                  <div className='px-3 pt-2 pb-1 text-left text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-slate-500'>
                    {cat.title}
                  </div>
                ) : (
                  idx > 0 && (
                    <div className='py-1'>
                      <div className='border-t border-gray-100 dark:border-slate-800' />
                    </div>
                  )
                )}
              </>
            )}
            <ul className='flex flex-col gap-1'>
              {cat.items.map((item) => (
                <SidebarItemMemo
                  key={item.key}
                  item={item}
                  depth={0}
                  isCollapsed={isCollapsed}
                  expandedKeys={model.expandedKeys}
                  dispatch={dispatch}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* User Footer Section */}
      {userProfile && (
        <div className='flex shrink-0 items-center gap-3 overflow-hidden border-t border-gray-100 p-3 dark:border-slate-800'>
          <div className='flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xs font-semibold text-gray-600 dark:bg-slate-800 dark:text-slate-300'>
            {userProfile.avatar || <UserIcon size={18} />}
          </div>
          {!isCollapsed && (
            <div className='flex min-w-0 flex-col truncate text-left'>
              <span className='truncate text-xs font-semibold text-gray-800 dark:text-slate-200'>
                {userProfile.name}
              </span>
              {userProfile.subtitle && (
                <span className='truncate text-[10px] text-gray-500 dark:text-slate-400'>
                  {userProfile.subtitle}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

export const SidebarMemo = memo(SidebarComponent, SidebarPropsEq.equals)
