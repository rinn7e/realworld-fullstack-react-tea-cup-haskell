import React from 'react'

import { ArticleEq } from '@/common/api/type/article'
import { ApiErrorEq, getHttpErrorEq } from '@/common/api/type'
import { memoStrategy } from '@/common/util'
import { SearchBar, type SearchOption } from '@/component/search-bar'
import { PaginationMemo } from '@rinn7e/tea-cup-pagination/lib/component'

import { ArticleDetailOverlay } from './sub-component/article-detail-overlay'
import { type Props, PropsEq } from './type'
import { mkPaginationConfig } from './helper'

const sortOptions: SearchOption[] = [
  { label: 'Creation Date', value: 'createdAt' },
  { label: 'Favorites', value: 'favoritesCount' },
  { label: 'Title', value: 'title' },
  { label: 'ID', value: 'id' },
]

export const ArticlesComponent: React.FC<Props> = ({ model, shared, dispatch }) => {
  const paginationConfig = mkPaginationConfig(shared, model)

  return (
    <div className='relative flex flex-col gap-[32px]'>
      <div className='flex flex-col gap-[24px]'>
        <h2 className='text-theme-secondary text-[28px] font-bold dark:text-white'>
          Articles
        </h2>
        <SearchBar
          searchText={model.searchText}
          sort={model.sort}
          sortOptions={sortOptions}
          onSearchChange={(text) =>
            dispatch({ _tag: 'ChangeSearchText', text })
          }
          onSortChange={(sort) => dispatch({ _tag: 'ChangeSort', sort })}
          placeholder='Search articles by title, slug, or content...'
        />
      </div>

      <div className='flex flex-col gap-[20px]'>
        <PaginationMemo
          model={model.pagination}
          dispatch={(subMsg) => dispatch({ _tag: 'PaginationMsg', subMsg })}
          config={paginationConfig}
          itemEq={ArticleEq}
          errEq={getHttpErrorEq(ApiErrorEq)}
        />
      </div>

      <ArticleDetailOverlay
        selectedArticle={model.selectedArticle}
        dispatch={dispatch}
      />
    </div>
  )
}

export const ArticlesMemo = memoStrategy(ArticlesComponent, PropsEq.equals)
