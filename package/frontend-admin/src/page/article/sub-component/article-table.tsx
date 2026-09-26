import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import { memo } from 'react'

import { type Article, ArticleEq } from '@/common/api'

import type { ArticleItemMsg } from '../type'

export type ArticleTableProps = {
  articles: Article[]
  itemDispatch: (item: Article, msg: ArticleItemMsg) => void
}

const ArticleTablePropsEq: EqClass.Eq<ArticleTableProps> = EqClass.struct({
  articles: A.getEq(ArticleEq),
  itemDispatch: EqAlways,
})

const ArticleTableComponent = ({
  articles,
  itemDispatch,
}: ArticleTableProps) => (
  <div className='dark:bg-surface-dark overflow-x-auto rounded-[12px] border border-slate-100 bg-white shadow-sm dark:border-white/10'>
    <table className='w-full border-collapse text-left'>
      <thead className='bg-slate-50 text-[12px] font-semibold tracking-wider text-slate-500 uppercase dark:bg-black/20 dark:text-slate-200'>
        <tr>
          <th className='px-[24px] py-[16px]'>ID</th>
          <th className='px-[24px] py-[16px]'>Slug</th>
          <th className='px-[24px] py-[16px]'>Title</th>
          <th className='px-[24px] py-[16px]'>Author</th>
          <th className='px-[24px] py-[16px] text-center'>Favorites</th>
          <th className='px-[24px] py-[16px]'>Created At</th>
        </tr>
      </thead>
      <tbody className='divide-y divide-slate-100 text-[14px] dark:divide-white/10'>
        {articles.map((a) => (
          <tr
            key={a.id}
            className='cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5'
            onClick={() =>
              itemDispatch(a, {
                _tag: 'SelectArticle',
                article: O.some(a),
              })
            }
          >
            <td className='px-[24px] py-[16px] font-mono text-slate-400 dark:text-slate-300'>
              {a.id}
            </td>
            <td className='px-[24px] py-[16px] font-mono text-[12px] text-slate-500 dark:text-slate-300'>
              {a.slug}
            </td>
            <td className='text-theme-secondary px-[24px] py-[16px] font-semibold dark:text-white'>
              {a.title}
            </td>
            <td className='px-[24px] py-[16px] text-slate-600 dark:text-slate-300'>
              {a.author.username}
            </td>
            <td className='px-[24px] py-[16px] text-center'>
              <span className='rounded-full bg-slate-50 px-[10px] py-[4px] text-[12px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300'>
                {a.favoritesCount}
              </span>
            </td>
            <td className='px-[24px] py-[16px] text-slate-400 dark:text-slate-300'>
              {a.createdAt.toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const ArticleTableMemo = memo(
  ArticleTableComponent,
  ArticleTablePropsEq.equals,
)
