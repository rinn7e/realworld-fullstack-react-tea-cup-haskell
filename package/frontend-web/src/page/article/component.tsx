import * as RD from '@devexperts/remote-data-ts'
import { Button, Image, Tag } from '@rinn7e/realworld-design-system'
import { cn } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Pencil, Trash2, UserMinus, UserPlus } from 'lucide-react'
import React from 'react'
import ReactMarkdown from 'react-markdown'

import type { ApiError, ArticleResponse, HttpError } from '@/common/api'
import { assetPath, memoStrategy } from '@/common/util'
import { ErrorMessages } from '@/component/error-messages'
import { favButtonView } from '@/component/fav-button'
import { IndeterminateProgressBar } from '@/component/indeterminate-progress-bar'
import { Link } from '@/component/link'

import { CommentSectionMemo } from './sub-component/comment-section/component'
import { type Props, PropsEq } from './type'

const ArticlePageComponent = ({ model, user, dispatch }: Props) => {
  return (
    <div className='flex min-h-full flex-col' data-test='article-page'>
      {pipe(
        model.article,
        RD.fold(
          () => <IndeterminateProgressBar />,
          () => <IndeterminateProgressBar />,
          (err: HttpError<ApiError>) => (
            <div className='mx-auto max-w-[1152px] px-[16px] py-[24px]'>
              <ErrorMessages error={err} />
            </div>
          ),

          (data: ArticleResponse) => {
            const isLoggedIn = O.isSome(user)
            const isAuthor =
              isLoggedIn && user.value.username === data.article.author.username
            const author = data.article.author

            const articleMeta = (isLight: boolean) => (
              <div
                className='flex flex-wrap items-center gap-[12px]'
                data-test='article-metadata'
              >
                <Link
                  route={{
                    page: {
                      _tag: 'ProfilePage',
                      username: author.username,
                      favorites: false,
                    },
                  }}
                >
                  <Image.View
                    src={author.image ? assetPath(author.image) : null}
                    defaultSrc={assetPath('/default-avatar.svg')}
                    className='h-[36px] w-[36px] rounded-full object-cover'
                    alt=''
                    dataTest='article-author-img'
                  />
                </Link>
                <div className='flex flex-col'>
                  <Link
                    route={{
                      page: {
                        _tag: 'ProfilePage',
                        username: author.username,
                        favorites: false,
                      },
                    }}
                    className={cn(
                      'block text-sm font-medium hover:underline',
                      isLight ? 'text-green-400' : 'text-green-600',
                    )}
                    data-test='article-author'
                  >
                    {author.username}
                  </Link>
                  <span className='date text-xs text-gray-400'>
                    {new Date(data.article.createdAt).toDateString()}
                  </span>
                </div>
                <div className='flex flex-wrap items-center gap-[8px]'>
                  {isLoggedIn &&
                    (author.following
                      ? Button.view({
                          color: 'gray',
                          variant: 'outline',
                          size: 'xsmall',
                          onClick: () =>
                            dispatch({
                              _tag: 'UnfollowAuthor',
                              username: author.username,
                            }),
                          className: isLight
                            ? 'border-gray-400 text-gray-300 hover:border-white hover:text-white'
                            : undefined,
                          children: () => (
                            <>
                              <UserMinus size={13} className='mr-1' /> Unfollow{' '}
                              {author.username}
                            </>
                          ),
                        })
                      : Button.view({
                          color: 'gray',
                          variant: 'outline',
                          size: 'xsmall',
                          onClick: () =>
                            dispatch({
                              _tag: 'FollowAuthor',
                              username: author.username,
                            }),
                          className: isLight
                            ? 'border-gray-400 text-gray-300 hover:border-white hover:text-white'
                            : undefined,
                          children: () => (
                            <>
                              <UserPlus size={13} className='mr-1' /> Follow{' '}
                              {author.username}
                            </>
                          ),
                        }))}
                  {favButtonView({
                    variant: 'detail',
                    isLight,
                    favorited: data.article.favorited,
                    favoritesCount: data.article.favoritesCount,
                    onClick: () =>
                      isLoggedIn &&
                      dispatch({
                        _tag: data.article.favorited
                          ? 'UnfavoriteArticle'
                          : 'FavoriteArticle',
                      }),
                  })}
                  {isAuthor && (
                    <>
                      <Link
                        route={{
                          page: {
                            _tag: 'EditorPage',
                            slug: O.some(data.article.slug),
                          },
                        }}
                        className={cn(
                          'flex items-center gap-[4px] rounded border px-[12px] py-[4px] text-xs transition-colors',
                          isLight
                            ? 'border-gray-400 text-gray-300 hover:border-white hover:text-white'
                            : 'border-gray-300 text-gray-600 hover:border-gray-500',
                        )}
                        data-test='article-edit-btn'
                      >
                        <Pencil size={13} /> Edit Article
                      </Link>
                      {Button.view({
                        color: 'red',
                        variant: 'outline',
                        size: 'xsmall',
                        onClick: () => dispatch({ _tag: 'DeleteArticle' }),
                        dataTest: 'article-delete-btn',
                        className: isLight
                          ? 'hover:bg-red-900'
                          : 'hover:bg-red-50',
                        children: () => (
                          <>
                            <Trash2 size={13} className='mr-1' /> Delete Article
                          </>
                        ),
                      })}
                    </>
                  )}
                </div>
              </div>
            )

            return (
              <div className='flex min-h-full flex-col'>
                {/* Article Header */}
                <div className='bg-gray-900 py-[40px] text-white shadow-inner'>
                  <div className='mx-auto flex max-w-[1152px] flex-col gap-[16px] px-[16px]'>
                    <h1 className='text-3xl leading-tight font-bold lg:text-4xl'>
                      {data.article.title}
                    </h1>
                    {articleMeta(true)}
                  </div>
                </div>

                {/* Article Body */}
                <div className='mx-auto flex w-full max-w-[1152px] flex-col gap-[32px] px-[16px] py-[32px]'>
                  <div className='flex flex-col gap-[16px]'>
                    <div
                      className='prose prose-gray prose-img:rounded-lg max-w-none'
                      data-test='article-body'
                    >
                      <ReactMarkdown>{data.article.body ?? ''}</ReactMarkdown>
                    </div>
                    <div
                      className='flex flex-wrap gap-[4px]'
                      data-test='tag-list'
                    >
                      {data.article.tagList.map((tag) =>
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

                  <hr className='border-gray-200' />

                  <div className='flex flex-col items-center gap-[32px]'>
                    {articleMeta(false)}

                    <CommentSectionMemo
                      model={model.commentSection}
                      user={user}
                      dispatch={(subMsg) =>
                        dispatch({ _tag: 'CommentSectionMsg', subMsg })
                      }
                    />
                  </div>
                </div>
              </div>
            )
          },
        ),
      )}
    </div>
  )
}

export const ArticlePageMemo = memoStrategy(
  ArticlePageComponent,
  PropsEq.equals,
)
