import { PaginationMemo } from '@rinn7e/tea-cup-pagination/lib/component'
import React from 'react'

import { ApiErrorEq, getHttpErrorEq } from '@/common/api/type'
import { ArticleEq } from '@/common/api/type/article'
import { type ArticleSortAttr } from '@/common/api/type/article'
import { memoStrategy } from '@/common/util'
import * as SearchBar from '@/component/search-bar'
import { SearchBarMemo } from '@/component/search-bar/component'

import { mkPaginationConfig } from './helper'
import { ArticleDetailOverlay } from './sub-component/article-detail-overlay'
import { type Props, PropsEq } from './type'

const sortOptions: SearchBar.SearchOption<ArticleSortAttr>[] = [
  { label: 'Creation Date', value: 'createdAt' },
  { label: 'Favorites', value: 'favoritesCount' },
  { label: 'Title', value: 'title' },
  { label: 'ID', value: 'id' },
]

export const ArticlesPageComponent: React.FC<Props> = ({
  model,
  shared,
  dispatch,
}) => {
  const paginationConfig = mkPaginationConfig(shared, model)

  return (
    <div className='relative flex flex-col gap-[32px]'>
      <div className='flex flex-col gap-[24px]'>
        <h2 className='text-theme-secondary text-[28px] font-bold dark:text-white'>
          Articles
        </h2>
        <SearchBarMemo<ArticleSortAttr>
          model={model.searchBar}
          sortOptions={sortOptions}
          sortToString={(s) => s}
          dispatch={(subMsg: SearchBar.Msg<ArticleSortAttr>) =>
            dispatch({ _tag: 'SearchBarMsg', subMsg })
          }
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

export const ArticlesPageMemo = memoStrategy(
  ArticlesPageComponent,
  PropsEq.equals,
)
