import * as RD from '@devexperts/remote-data-ts'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { ImageMemo as DsImageMemo } from '@rinn7e/realworld-design-system/element/image/component'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Trash2 } from 'lucide-react'
import React from 'react'

import {
  type ApiError,
  type CommentsResponse,
  type HttpError,
} from '@/common/api'
import { assetPath, memoStrategy } from '@/common/util'
import { DotLoading } from '@/component/dot-loading'
import { ErrorMessages } from '@/component/error-messages'
import { Link } from '@/component/link'

import { type Props, PropsEq } from './type'

const CommentSectionComponent = ({ model, user, dispatch }: Props) => {
  const isLoggedIn = O.isSome(user)

  return (
    <div className='flex w-full max-w-[700px] flex-col gap-[24px]'>
      {isLoggedIn && (
        <form
          className='flex flex-col overflow-hidden rounded border border-gray-200'
          data-test='comment-form'
          onSubmit={(e) => {
            e.preventDefault()
            dispatch({ _tag: 'SubmitComment' })
          }}
        >
          <textarea
            className='min-h-[100px] w-full resize-none p-[12px] text-sm text-gray-800 outline-none'
            data-test='comment-textarea'
            rows={3}
            placeholder='Write a comment...'
            value={model.newCommentInput}
            onChange={(e) =>
              dispatch({
                _tag: 'SetCommentInput',
                value: e.target.value,
              })
            }
          />

          {model.newCommentError && (
            <ErrorMessages error={model.newCommentError} />
          )}

          <div className='flex items-center justify-between border-t border-gray-100 bg-gray-50 px-[12px] py-[8px]'>
            {pipe(
              user,
              O.fold(
                () => null,
                (u) => (
                  <DsImageMemo
                    src={u.image ? assetPath(u.image) : null}
                    defaultSrc={assetPath('/default-avatar.svg')}
                    className='h-[20px] w-[20px] rounded-full object-cover'
                    alt=''
                    dataTest='comment-author-img'
                  />
                ),
              ),
            )}
            <DsButtonMemo
              type='submit'
              color='green'
              size='xsmall'>Post Comment</DsButtonMemo>
          </div>
        </form>
      )}

      {pipe(
        model.comments,
        RD.fold(
          () => (
            <div className='py-[12px]'>
              <DotLoading className='text-2xl text-green-600' />
            </div>
          ),
          () => (
            <div className='py-[12px]'>
              <DotLoading className='text-2xl text-green-600' />
            </div>
          ),
          (err: HttpError<ApiError>) => (
            <div className='py-[12px]'>
              <ErrorMessages error={err} />
            </div>
          ),
          (commentsData: CommentsResponse) => (
            <div className='flex flex-col gap-[16px]'>
              {commentsData.comments.map((comment) => (
                <div
                  key={comment.id}
                  className='overflow-hidden rounded border border-gray-200'
                  data-test='comment-card'
                >
                  <div className='p-[16px]'>
                    <p className='text-sm whitespace-pre-wrap text-gray-800'>
                      {comment.body}
                    </p>
                  </div>
                  <div className='card-footer flex items-center gap-[8px] border-t border-gray-100 bg-gray-50 px-[16px] py-[8px] text-xs'>
                    <Link
                      route={{
                        page: {
                          _tag: 'ProfilePage',
                          username: comment.author.username,
                          favorites: false,
                        },
                      }}
                    >
                      <DsImageMemo
                        src={
                          comment.author.image
                            ? assetPath(comment.author.image)
                            : null
                        }
                        defaultSrc={assetPath('/default-avatar.svg')}
                        className='h-[20px] w-[20px] rounded-full object-cover'
                        alt=''
                        dataTest='comment-author-img'
                      />
                    </Link>
                    <Link
                      route={{
                        page: {
                          _tag: 'ProfilePage',
                          username: comment.author.username,
                          favorites: false,
                        },
                      }}
                      className='font-medium text-green-600 hover:underline'
                    >
                      {comment.author.username}
                    </Link>
                    <span className='text-gray-400'>
                      {new Date(comment.createdAt).toDateString()}
                    </span>
                    {isLoggedIn &&
                      user.value.username === comment.author.username && (
                        <span className='ml-auto'>
                          <DsButtonMemo
                            color='gray'
                            variant='ghost'
                            dataTest='delete-comment-btn'
                            onClick={() =>
                              dispatch({
                                _tag: 'DeleteComment',
                                id: comment.id,
                              })
                            }
                            className='hover:text-red-500'
                          >
                            <Trash2 size={12} />
                          </DsButtonMemo>
                        </span>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ),
        ),
      )}
    </div>
  )
}

export const CommentSectionMemo = memoStrategy(
  CommentSectionComponent,
  PropsEq.equals,
)
