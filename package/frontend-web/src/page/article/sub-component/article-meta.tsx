import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { ImageMemo as DsImageMemo } from '@rinn7e/realworld-design-system/element/image/component'
import { EqAlways, cn } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import * as B from 'fp-ts/lib/boolean'
import { Pencil, Trash2, UserMinus, UserPlus } from 'lucide-react'
import { memo } from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { type Article, ArticleEq, type User, UserEq } from '@/common/api'
import { assetPath } from '@/common/util'
import { FavButtonMemo } from '@/component/fav-button'
import { Link } from '@/component/link'

import type { Msg } from '../type'

export type ArticleMetaProps = {
  article: Article
  isLight: boolean
  user: Option<User>
  dispatch: Dispatcher<Msg>
}

const ArticleMetaPropsEq: EqClass.Eq<ArticleMetaProps> = EqClass.struct({
  article: ArticleEq,
  isLight: B.Eq,
  user: O.getEq(UserEq),
  dispatch: EqAlways,
})

const ArticleMetaComponent = ({
  article,
  isLight,
  user,
  dispatch,
}: ArticleMetaProps) => {
  const isLoggedIn = O.isSome(user)
  const isAuthor = isLoggedIn && user.value.username === article.author.username
  const author = article.author

  return (
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
        <DsImageMemo
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
          {article.createdAt.toDateString()}
        </span>
      </div>
      <div className='flex flex-wrap items-center gap-[8px]'>
        {isLoggedIn &&
          (author.following ? (
            <DsButtonMemo
              color='gray'
              variant='outline'
              size='xsmall'
              onClick={() =>
                dispatch({
                  _tag: 'UnfollowAuthor',
                  username: author.username,
                })
              }
              className={
                isLight
                  ? 'border-gray-400 text-gray-300 hover:border-white hover:text-white'
                  : undefined
              }
            >
              <span className='flex items-center gap-[4px]'>
                <UserMinus size={13} />
                <span>Unfollow {author.username}</span>
              </span>
            </DsButtonMemo>
          ) : (
            <DsButtonMemo
              color='gray'
              variant='outline'
              size='xsmall'
              onClick={() =>
                dispatch({
                  _tag: 'FollowAuthor',
                  username: author.username,
                })
              }
              className={
                isLight
                  ? 'border-gray-400 text-gray-300 hover:border-white hover:text-white'
                  : undefined
              }
            >
              <span className='flex items-center gap-[4px]'>
                <UserPlus size={13} />
                <span>Follow {author.username}</span>
              </span>
            </DsButtonMemo>
          ))}
        <FavButtonMemo
          variant='detail'
          favorited={article.favorited}
          favoritesCount={article.favoritesCount}
          onClick={() => {
            if (isLoggedIn) {
              dispatch({
                _tag: article.favorited
                  ? 'UnfavoriteArticle'
                  : 'FavoriteArticle',
              })
            }
          }}
        />
        {isAuthor && (
          <>
            <Link
              route={{
                page: {
                  _tag: 'EditorPage',
                  slug: O.some(article.slug),
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
            <DsButtonMemo
              color='red'
              variant='outline'
              size='xsmall'
              onClick={() => dispatch({ _tag: 'DeleteArticle' })}
              dataTest='article-delete-btn'
              className={isLight ? 'hover:bg-red-900' : 'hover:bg-red-50'}
            >
              <span className='flex items-center gap-[4px]'>
                <Trash2 size={13} /> Delete Article
              </span>
            </DsButtonMemo>
          </>
        )}
      </div>
    </div>
  )
}

export const ArticleMetaMemo = memo(
  ArticleMetaComponent,
  ArticleMetaPropsEq.equals,
)
