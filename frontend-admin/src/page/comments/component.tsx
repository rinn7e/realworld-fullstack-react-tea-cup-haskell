import { PaginationMemo } from '@rinn7e/tea-cup-pagination/lib/component'
import React from 'react'

import { ApiErrorEq, getHttpErrorEq } from '@/common/api/type'
import { CommentEq, type CommentSortAttr } from '@/common/api/type/comment'
import { memoStrategy } from '@/common/util'
import * as SearchBar from '@/component/search-bar'
import { SearchBarMemo } from '@/component/search-bar/component'

import { mkPaginationConfig } from './helper'
import { CommentDetailOverlay } from './sub-component/comment-detail-overlay'
import { type Props, PropsEq } from './type'

const sortOptions: SearchBar.SearchOption<CommentSortAttr>[] = [
  { label: 'Creation Date', value: 'createdAt' },
  { label: 'Author', value: 'author' },
  { label: 'ID', value: 'id' },
]

export const CommentsPageComponent: React.FC<Props> = ({
  model,
  shared,
  dispatch,
}) => {
  const paginationConfig = mkPaginationConfig(shared, model)

  return (
    <div className='relative flex flex-col gap-[32px]'>
      <div className='flex flex-col gap-[24px]'>
        <h2 className='text-theme-secondary text-[28px] font-bold dark:text-white'>
          Comments
        </h2>
        <SearchBarMemo<CommentSortAttr>
          model={model.searchBar}
          sortOptions={sortOptions}
          sortToString={(s) => s}
          dispatch={(subMsg: SearchBar.Msg<CommentSortAttr>) =>
            dispatch({ _tag: 'SearchBarMsg', subMsg })
          }
          placeholder='Search comments by author or message content...'
        />
      </div>


      <PaginationMemo
        model={model.pagination}
        config={paginationConfig}
        dispatch={(subMsg) => dispatch({ _tag: 'PaginationMsg', subMsg })}
        itemEq={CommentEq}
        errEq={getHttpErrorEq(ApiErrorEq)}
      />

      <CommentDetailOverlay
        selectedComment={model.selectedComment}
        dispatch={dispatch}
      />
    </div>
  )
}

export const CommentsPageMemo = memoStrategy(
  CommentsPageComponent,
  PropsEq.equals,
)
