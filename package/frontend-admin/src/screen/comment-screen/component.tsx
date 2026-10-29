import { PaginationMemo } from '@rinn7e/tea-cup-pagination/component'
import React, { memo } from 'react'

import {
  ApiErrorEq,
  CommentEq,
  type CommentSortAttr,
  getHttpErrorEq,
} from '@core/common/api'
import type * as SearchBar from '@core/component/search-bar'
import { type Props, PropsEq } from '@core/screen/comment-screen/type'

import { SearchBarMemo } from '@/component/search-bar/component'

import { CommentDetailOverlayMemo } from './sub-component/comment-detail-overlay'
import { mkPaginationViewConfig } from './util'

const sortOptions: SearchBar.SearchOption<CommentSortAttr>[] = [
  { label: 'Creation Date', value: 'createdAt' },
  { label: 'Author', value: 'author' },
  { label: 'ID', value: 'id' },
]

const CommentScreenComponent = ({ model, shared, dispatch }: Props) => {
  const paginationConfig = mkPaginationViewConfig(shared, model)

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

      <CommentDetailOverlayMemo
        selectedComment={model.selectedComment}
        dispatch={dispatch}
      />
    </div>
  )
}

export const CommentScreenMemo = memo(CommentScreenComponent, PropsEq.equals)
