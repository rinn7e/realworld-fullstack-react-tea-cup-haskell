import { PaginationMemo } from '@rinn7e/tea-cup-pagination/lib/component'
import { ChevronDown, ChevronRight } from 'lucide-react'
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

export const VisitorPageComponent: React.FC<Props> = ({
  model,
  shared,
  dispatch,
}) => {
  const paginationConfig = mkPaginationConfig(shared, model)

  return (
    <div className='relative flex flex-col gap-[32px]'>
      <div className='flex flex-col gap-[24px]'>
        <div className='flex items-center gap-[12px]'>
          <h2 className='text-theme-secondary text-[28px] font-bold dark:text-white'>
            Visitors
          </h2>
          <button
            onClick={() => dispatch({ _tag: 'ToggleDescription' })}
            className='flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white'
            aria-label={
              model.isDescriptionOpen ? 'Hide description' : 'Show description'
            }
          >
            {model.isDescriptionOpen ? (
              <ChevronDown size={24} />
            ) : (
              <ChevronRight size={24} />
            )}
          </button>
        </div>
        {model.isDescriptionOpen && (
          <p className='animate-in fade-in slide-in-from-top-1 max-w-[640px] text-[14px] leading-relaxed text-slate-500 duration-200 dark:text-slate-400'>
            Each entry here represents a{' '}
            <span className='font-semibold text-slate-700 dark:text-slate-200'>
              unique device
            </span>{' '}
            that has visited the website — not an individual page hit.
            Uniqueness is determined by a SHA-256 fingerprint derived from the
            visitor's IP address, browser User-Agent, and Accept-Language
            header. Revisiting the site updates the existing record's last-seen
            path and timestamp rather than creating a new one.
          </p>
        )}
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

export const VisitorPageMemo = memoStrategy(
  VisitorPageComponent,
  PropsEq.equals,
)
