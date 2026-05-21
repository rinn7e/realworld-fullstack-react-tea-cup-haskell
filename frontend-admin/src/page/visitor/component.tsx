import { PaginationMemo } from '@rinn7e/tea-cup-pagination/lib/component'
import React from 'react'

import { ApiErrorEq, getHttpErrorEq } from '@/common/api/type'
import { VisitorEq, type VisitorSortAttr } from '@/common/api/type/visitor'
import { memoStrategy } from '@/common/util'
import type * as SearchBar from '@/component/search-bar'
import { SearchBarMemo } from '@/component/search-bar/component'

import { mkPaginationConfig } from './helper'
import { VisitorDetailOverlay } from './sub-component/visitor-detail-overlay'
import { type Props, PropsEq } from './type'

const sortOptions: SearchBar.SearchOption<VisitorSortAttr>[] = [
  { label: 'Timestamp', value: 'timestamp' },
  { label: 'Path', value: 'path' },
  { label: 'IP', value: 'ip' },
  { label: 'ID', value: 'id' },
]

export const VisitorsPageComponent: React.FC<Props> = ({
  model,
  shared,
  dispatch,
}) => {
  const paginationConfig = mkPaginationConfig(shared, model)

  return (
    <div className='relative flex flex-col gap-[32px]'>
      <div className='flex flex-col gap-[24px]'>
        <h2 className='text-theme-secondary text-[28px] font-bold dark:text-white'>
          Visitors
        </h2>
        <SearchBarMemo<VisitorSortAttr>
          model={model.searchBar}
          sortOptions={sortOptions}
          sortToString={(s) => s}
          dispatch={(subMsg: SearchBar.Msg<VisitorSortAttr>) =>
            dispatch({ _tag: 'SearchBarMsg', subMsg })
          }
          placeholder='Search visitors by IP or Path (start with /)...'
        />
      </div>

      <div className='flex flex-col gap-[20px]'>
        <PaginationMemo
          model={model.pagination}
          dispatch={(subMsg) => dispatch({ _tag: 'PaginationMsg', subMsg })}
          config={paginationConfig}
          itemEq={VisitorEq}
          errEq={getHttpErrorEq(ApiErrorEq)}
        />
      </div>

      <VisitorDetailOverlay
        selectedVisitor={model.selectedVisitor}
        dispatch={dispatch}
      />
    </div>
  )
}

export const VisitorsPageMemo = memoStrategy(
  VisitorsPageComponent,
  PropsEq.equals,
)
