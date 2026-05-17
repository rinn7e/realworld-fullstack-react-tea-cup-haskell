import React from 'react'

import { type Sort } from '@/common/type/filter'

export type SearchOption = {
  label: string
  value: string
}

type Props = {
  searchText: string
  sort: Sort
  sortOptions: SearchOption[]
  onSearchChange: (text: string) => void
  onSortChange: (sort: Sort) => void
  placeholder?: string
}

export const SearchBar: React.FC<Props> = ({
  searchText,
  sort,
  sortOptions,
  onSearchChange,
  onSortChange,
  placeholder = 'Search...',
}) => {
  return (
    <div className='flex flex-col gap-[16px] lg:flex-row lg:items-center'>
      <div className='dark:bg-surface-dark focus-within:border-theme-primary focus-within:ring-theme-primary/10 flex flex-grow items-center gap-[16px] rounded-[16px] border border-slate-100 bg-white p-[16px] shadow-sm transition-all focus-within:ring-4 dark:border-white/20'>
        <div className='pl-[4px] text-slate-400 dark:text-slate-200'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-[24px] w-[24px]'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
        <input
          type='text'
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className='flex-grow bg-transparent text-[18px] font-medium text-slate-700 outline-none placeholder:text-slate-300 dark:text-white dark:placeholder:text-slate-400'
        />
        {searchText && (
          <button
            type='button'
            onClick={() => onSearchChange('')}
            className='rounded-full bg-slate-100 p-[4px] text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 dark:bg-black/20 dark:text-slate-200 dark:hover:bg-black/40 dark:hover:text-white'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-[16px] w-[16px]'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        )}
      </div>

      <div className='dark:bg-surface-dark flex items-center gap-[12px] rounded-[16px] border border-slate-100 bg-white p-[8px] shadow-sm dark:border-white/20'>
        <div className='pl-[12px] text-[12px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-200'>
          Sort By
        </div>
        <select
          value={sort.attr}
          onChange={(e) => onSortChange({ ...sort, attr: e.target.value })}
          className='cursor-pointer rounded-[10px] border border-slate-100 bg-slate-50 px-[16px] py-[10px] text-[14px] font-bold text-slate-600 transition-colors outline-none hover:bg-slate-100 dark:border-white/20 dark:bg-black/20 dark:text-white dark:hover:bg-black/40'
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type='button'
          onClick={() =>
            onSortChange({
              ...sort,
              direction: sort.direction === 'asc' ? 'desc' : 'asc',
            })
          }
          className='bg-theme-primary/10 text-theme-primary hover:bg-theme-primary/20 flex items-center gap-[8px] rounded-[10px] px-[16px] py-[10px] text-[14px] font-bold transition-colors'
        >
          {sort.direction === 'asc' ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-[16px] w-[16px]'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 15l7-7 7 7'
              />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-[16px] w-[16px]'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          )}
          {sort.direction.toUpperCase()}
        </button>
      </div>
    </div>
  )
}
