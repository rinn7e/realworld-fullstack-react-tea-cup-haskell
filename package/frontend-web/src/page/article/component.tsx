import * as RD from '@devexperts/remote-data-ts'
import { ProgressMemo as DsProgressMemo } from '@rinn7e/realworld-design-system/element/progress/component'
import { TagMemo as DsTagMemo } from '@rinn7e/realworld-design-system/element/tag/component'
import { pipe } from 'fp-ts/lib/function'
import React, { memo } from 'react'
import ReactMarkdown from 'react-markdown'

import type { ApiError, ArticleResponse, HttpError } from '@/common/api'
import { ErrorMessagesMemo } from '@/component/error-messages/component'

import { ArticleMetaMemo } from './sub-component/article-meta'
import { CommentSectionMemo } from './sub-component/comment-section/component'
import { type Props, PropsEq } from './type'

const ArticlePageComponent = ({ model, user, dispatch }: Props) => {
  return (
    <div className='flex min-h-full flex-col' data-test='article-page'>
      {pipe(
        model.article,
        RD.fold(
          () => (
            <DsProgressMemo
              isIndeterminate={true}
              size='xsmall'
              color='green'
            />
          ),
          () => (
            <DsProgressMemo
              isIndeterminate={true}
              size='xsmall'
              color='green'
            />
          ),
          (err: HttpError<ApiError>) => (
            <div className='mx-auto max-w-[1152px] px-[16px] py-[24px]'>
              <ErrorMessagesMemo error={err} />
            </div>
          ),

          (data: ArticleResponse) => {
            return (
              <div className='flex min-h-full flex-col'>
                {/* Article Header */}
                <div className='bg-gray-900 py-[40px] text-white shadow-inner'>
                  <div className='mx-auto flex max-w-[1152px] flex-col gap-[16px] px-[16px]'>
                    <h1 className='text-3xl leading-tight font-bold lg:text-4xl'>
                      {data.article.title}
                    </h1>
                    <ArticleMetaMemo
                      article={data.article}
                      isLight={true}
                      user={user}
                      dispatch={dispatch}
                    />
                  </div>
                </div>

                {/* Article Body */}
                <div className='mx-auto flex w-full max-w-[1152px] flex-col gap-[32px] px-[16px] py-[32px]'>
                  <div className='flex flex-col gap-[16px]'>
                    <div
                      className='prose prose-gray dark:prose-invert prose-img:rounded-lg max-w-none'
                      data-test='article-body'
                    >
                      <ReactMarkdown>{data.article.body}</ReactMarkdown>
                    </div>
                    <div
                      className='flex flex-wrap gap-[4px]'
                      data-test='tag-list'
                    >
                      {data.article.tagList.map((tag) => (
                        <DsTagMemo
                          key={tag}
                          dataTest='article-tag'
                          color='gray'
                          variant='outline'
                          isRounded={true}
                          size='small'
                        >
                          {tag}
                        </DsTagMemo>
                      ))}
                    </div>
                  </div>

                  <hr className='border-gray-200 dark:border-zinc-800' />

                  <div className='flex flex-col items-center gap-[32px]'>
                    <ArticleMetaMemo
                      article={data.article}
                      isLight={false}
                      user={user}
                      dispatch={dispatch}
                    />

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

export const ArticlePageMemo = memo(ArticlePageComponent, PropsEq.equals)
