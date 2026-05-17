import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { assetPath } from '@/common/util'
import { DotLoading } from '@/component/dot-loading'
import { favButtonView } from '@/component/fav-button'
import { Link } from '@/component/link'

import type { Model, Msg } from './type'

export interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const ArticleShortComponent: React.FC<Props> = ({ model, dispatch }) => {
  return (
    <div
      className='flex flex-col gap-[12px] border-b border-gray-200 py-[24px]'
      data-test='article-preview'
    >
      <div className='flex items-center justify-between'>
        <div
          className='flex items-center gap-[12px]'
          data-test='article-metadata'
        >
          <Link
            route={{
              page: {
                _tag: 'ProfilePage',
                username: model.author.username,
                favorites: false,
              },
            }}
          >
            <img
              src={assetPath(model.author.image || '/default-avatar.svg')}
              className='h-[32px] w-[32px] rounded-full object-cover'
              alt=''
              data-test='article-author-img'
            />
          </Link>
          <div className='info flex flex-col'>
            <Link
              route={{
                page: {
                  _tag: 'ProfilePage',
                  username: model.author.username,
                  favorites: false,
                },
              }}
              className='block text-sm font-medium text-green-600 hover:underline'
              data-test='article-author'
            >
              {model.author.username}
            </Link>
            <span
              className='date text-xs text-gray-400'
              data-test='article-date'
            >
              {new Date(model.createdAt).toDateString()}
            </span>
          </div>
        </div>
        {favButtonView({
          favorited: model.favorited,
          favoritesCount: model.favoritesCount,
          onClick: () =>
            dispatch({
              _tag: model.favorited ? 'Unfavorite' : 'Favorite',
            }),
        })}
      </div>
      <Link
        route={{
          page: {
            _tag: 'ArticlePage',
            slug: model.slug,
          },
        }}
        className='flex flex-col gap-[12px]'
        data-test='article-link'
      >
        <div className='flex flex-col gap-[4px]'>
          <h1 className='line-clamp-2 text-xl font-bold text-gray-900'>
            {model.title}
          </h1>
          <p
            className='line-clamp-3 text-sm text-gray-500'
            data-test='article-description'
          >
            {model.description}
          </p>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-xs text-gray-400'>
            Read more
            <DotLoading className='gap-[0px]' />
          </span>
          <ul className='flex flex-wrap gap-[4px]' data-test='tag-list'>
            {model.tagList.map((tag) => (
              <li
                key={tag}
                className='rounded-full border border-gray-300 px-[8px] py-[2px] text-xs text-gray-400'
                data-test='article-tag'
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </div>
  )
}
