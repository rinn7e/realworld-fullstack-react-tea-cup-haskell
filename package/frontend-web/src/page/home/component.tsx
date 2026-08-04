import * as RD from '@devexperts/remote-data-ts'
import { TagMemo as DsTagMemo } from '@rinn7e/realworld-design-system/element/tag/component'
import { PaginationMemo } from '@rinn7e/tea-cup-pagination/lib/component'
import { cn } from '@rinn7e/tea-cup-prelude'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import { ApiErrorEq, type TagsResponse, getHttpErrorEq } from '@/common/api'
import { ArticleEq } from '@/common/api/type/article'
import {
  type AppRoute,
  globalFeedTab,
  homePage,
  tagFeedTab,
  userFeedTab,
} from '@/common/type/route'
import { memoStrategy } from '@/common/util'
import { DotLoading } from '@/component/dot-loading'
import { Link } from '@/component/link'

import { mkPaginationConfig } from './helper'
import { type Props, PropsEq } from './type'

const HomePageComponent = ({ model, shared, dispatch }: Props) => {
  const paginationConfig = mkPaginationConfig(shared, model.tab)

  return (
    <div className='flex min-h-full flex-col'>
      {/* Hero Section */}
      <div
        className='banner bg-green-600 py-[48px] text-center text-white shadow-inner'
        data-test='hero-banner'
      >
        <div className='mx-auto flex max-w-[1152px] flex-col gap-[8px] px-[16px]'>
          <h1 className='text-4xl font-bold tracking-tight lg:text-5xl'>
            conduit
          </h1>
          <p className='text-base font-light opacity-90 lg:text-lg'>
            A place to share your knowledge.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className='mx-auto w-full max-w-[1152px] px-[16px] py-[24px]'>
        <div
          className={cn(
            // shared
            'flex flex-col gap-[24px]',
            // desktop
            'lg:flex-row lg:gap-[48px]',
          )}
        >
          {/* Article List */}
          <div className='flex min-w-0 flex-1 flex-col'>
            <div
              className='flex border-b border-gray-200 dark:border-zinc-800'
              data-test='feed-toggle'
            >
              {renderTabView(model.tab._tag === 'UserFeedTab', 'Your Feed', {
                page: homePage(userFeedTab()),
              })}
              {renderTabView(
                model.tab._tag === 'GlobalFeedTab',
                'Global Feed',
                { page: homePage(globalFeedTab()) },
              )}
              {model.tab._tag === 'TagFeedTab' &&
                renderTabView(true, `# ${model.tab.tag}`, {
                  page: homePage(tagFeedTab(model.tab.tag)),
                })}
            </div>

            <PaginationMemo
              itemEq={ArticleEq}
              errEq={getHttpErrorEq(ApiErrorEq)}
              config={paginationConfig}
              model={model.pagination}
              dispatch={(subMsg) => dispatch({ _tag: 'PaginationMsg', subMsg })}
            />
          </div>

          {/* Popular Tags */}
          <div
            className='w-full shrink-0 lg:w-[224px]'
            data-test='home-sidebar'
          >
            <div
              className='flex flex-col gap-[12px] rounded-lg bg-gray-50 p-[16px] dark:bg-zinc-900'
              data-test='popular-tags'
            >
              <p className='text-sm font-semibold text-gray-700 dark:text-zinc-300'>
                Popular Tags
              </p>
              {pipe(
                model.tags,
                RD.fold(
                  () => <DotLoading className='text-2xl text-gray-400' />,
                  () => <DotLoading className='text-2xl text-gray-400' />,
                  () => (
                    <span className='text-xs text-red-400'>
                      Error loading tags
                    </span>
                  ),
                  (data: TagsResponse) => (
                    <div
                      className='flex flex-wrap gap-[4px]'
                      data-test='tag-list'
                    >
                      {data.tags.map((tag) => (
                        <DsTagMemo
                          key={tag}
                          dataTest='tag-pill'
                          color='gray'
                          isRounded={true}
                          size='small'
                          onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                            e.preventDefault()
                            dispatch({
                              _tag: 'ChangeTab',
                              tab: tagFeedTab(tag),
                            })
                          }}
                        >
                          {tag}
                        </DsTagMemo>
                      ))}
                    </div>
                  ),
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const renderTabView = (active: boolean, label: string, route: AppRoute) => {
  return (
    <Link
      route={route}
      className={cn(
        'border-b-2 px-4 py-2 font-medium transition-colors',
        active
          ? 'border-green-500 text-green-500'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200',
      )}
      data-test='home-tab'
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}

export const HomePageMemo = memoStrategy(HomePageComponent, PropsEq.equals)
