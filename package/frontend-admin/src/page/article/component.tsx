import { PaginationMemo } from '@rinn7e/tea-cup-pagination/component'
import React, { memo } from 'react'

import {
  ApiErrorEq,
  ArticleEq,
  type ArticleSortAttr,
  getHttpErrorEq,
} from '@/common/api'
import type * as SearchBar from '@/component/search-bar'
import { SearchBarMemo } from '@/component/search-bar/component'

import { ArticleDetailOverlayMemo } from './sub-component/article-detail-overlay'
import { type Props, PropsEq } from './type'
import { mkPaginationConfig } from './util'

const sortOptions: SearchBar.SearchOption<ArticleSortAttr>[] = [
  { label: 'Creation Date', value: 'createdAt' },
  { label: 'Favorites', value: 'favoritesCount' },
  { label: 'Title', value: 'title' },
  { label: 'ID', value: 'id' },
]

const ArticlePageComponent = ({ model, shared, dispatch }: Props) => {
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

      <ArticleDetailOverlayMemo
        selectedArticle={model.selectedArticle}
        dispatch={dispatch}
      />
    </div>
  )
}

export const ArticlePageMemo = memo(ArticlePageComponent, PropsEq.equals)
