import { Content, Image, Tag, Title } from '@rinn7e/realworld-design-system'
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
            <Image.View
              src={model.author.image ? assetPath(model.author.image) : null}
              defaultSrc={assetPath('/default-avatar.svg')}
              className='h-[32px] w-[32px] rounded-full object-cover'
              alt=''
              dataTest='article-author-img'
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
          {Title.view({
            size: 4,
            className: 'line-clamp-2',
            children: () => model.title,
          })}
          {Content.view({
            size: 'normal',
            className: 'line-clamp-3 text-sm text-gray-500',
            children: () => model.description,
          })}
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-xs text-gray-400'>
            Read more
            <DotLoading className='gap-[0px]' />
          </span>
          <div className='flex flex-wrap gap-[4px]' data-test='tag-list'>
            {model.tagList.map((tag) =>
              Tag.view({
                key: tag,
                dataTest: 'article-tag',
                color: 'gray',
                variant: 'outline',
                isRounded: true,
                size: 'small',
                children: () => tag,
              }),
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
