import * as RD from '@devexperts/remote-data-ts'
import { Button, Image } from '@rinn7e/realworld-design-system'
import { PaginationMemo } from '@rinn7e/tea-cup-pagination/lib/component'
import { cn } from '@rinn7e/tea-cup-prelude'
import { pipe } from 'fp-ts/lib/function'
import { RotateCw, Settings, UserPlus } from 'lucide-react'
import React from 'react'

import { ApiErrorEq, type ProfileResponse, getHttpErrorEq } from '@/common/api'
import { ArticleEq } from '@/common/api/type/article'
import { API_BASE } from '@/common/env'
import { type AppRoute } from '@/common/type/route'
import { assetPath, memoStrategy } from '@/common/util'
import { ErrorMessages } from '@/component/error-messages'
import { IndeterminateProgressBar } from '@/component/indeterminate-progress-bar'
import { Link } from '@/component/link'

import { mkPaginationConfig } from './helper'
import { type Props, PropsEq } from './type'

const ProfilePageComponent = ({
  model,
  shared,
  dispatch,
  isCurrentUser,
  route,
}: Props) => {
  const username = route.page._tag === 'ProfilePage' ? route.page.username : ''
  const paginationConfig = mkPaginationConfig(
    shared,
    username,
    model.showFavorites,
  )

  return (
    <div className='flex min-h-full flex-col' data-test='profile-page'>
      {pipe(
        model.profile,
        RD.fold(
          () => <IndeterminateProgressBar />,
          () => <IndeterminateProgressBar />,
          () => profileErrorView(route),

          (data: ProfileResponse) => (
            <>
              {/* Header Banner */}
              <div
                className='border-b border-gray-200 bg-gray-50 py-[40px] text-center shadow-inner'
                data-test='user-info-section'
              >
                <div className='mx-auto flex max-w-[1152px] flex-col items-center gap-[12px] px-[16px]'>
                  {/* Avatar */}
                  <Image.View
                    src={
                      data.profile.image ? assetPath(data.profile.image) : null
                    }
                    defaultSrc={assetPath('/default-avatar.svg')}
                    className='h-[96px] w-[96px] rounded-full border-[4px] border-white object-cover shadow-sm'
                    dataTest='profile-avatar'
                    alt=''
                  />
                  <div className='flex flex-col gap-[4px]'>
                    <h4 className='text-2xl font-bold text-gray-900'>
                      {data.profile.username}
                    </h4>
                    <p
                      className='max-w-[600px] text-sm text-gray-500'
                      data-test='user-bio'
                    >
                      {data.profile.bio || ''}
                    </p>
                  </div>

                  {pipe(
                    model.followRd,
                    RD.fold(
                      () => null,
                      () => null,
                      (err) => (
                        <div className='mb-[16px]'>
                          <ErrorMessages error={err} />
                        </div>
                      ),
                      () => null,
                    ),
                  )}

                  {pipe(
                    model.unfollowRd,
                    RD.fold(
                      () => null,
                      () => null,
                      (err) => (
                        <div className='mb-[16px]'>
                          <ErrorMessages error={err} />
                        </div>
                      ),
                      () => null,
                    ),
                  )}

                  <div className='pt-[4px]'>
                    {isCurrentUser ? (
                      <Link
                        route={{ page: { _tag: 'SettingsPage' } }}
                        className='inline-flex items-center gap-[6px] rounded border border-gray-400 px-[12px] py-[6px] text-sm text-gray-600 transition-colors hover:border-gray-600'
                        data-test='edit-profile-settings'
                      >
                        <Settings size={13} /> Edit Profile Settings
                      </Link>
                    ) : (
                      Button.view({
                        color: 'gray',
                        variant: 'outline',
                        size: 'small',
                        dataTest: 'follow-btn',
                        onClick: () =>
                          dispatch({
                            _tag: data.profile.following
                              ? 'Unfollow'
                              : 'Follow',
                          }),
                        children: () => (
                          <>
                            <UserPlus size={13} className='mr-1.5' />
                            {data.profile.following
                              ? `Unfollow ${data.profile.username}`
                              : `Follow ${data.profile.username}`}
                          </>
                        ),
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className='mx-auto flex w-full max-w-[1152px] flex-col gap-[24px] px-[16px] py-[24px]'>
                <div className='flex border-b border-gray-200'>
                  <a
                    href='#'
                    className={cn(
                      'border-b-2 px-[16px] py-[8px] text-sm font-medium transition-colors',
                      !model.showFavorites
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700',
                    )}
                    data-test='profile-tab'
                    aria-current={!model.showFavorites ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      dispatch({ _tag: 'ToggleFavorites', show: false })
                    }}
                  >
                    My Articles
                  </a>
                  <a
                    href='#'
                    className={cn(
                      'border-b-2 px-[16px] py-[8px] text-sm font-medium transition-colors',
                      model.showFavorites
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700',
                    )}
                    data-test='profile-tab'
                    aria-current={model.showFavorites ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      dispatch({ _tag: 'ToggleFavorites', show: true })
                    }}
                  >
                    Favorited Articles
                  </a>
                </div>

                <PaginationMemo
                  itemEq={ArticleEq}
                  errEq={getHttpErrorEq(ApiErrorEq)}
                  config={paginationConfig}
                  model={model.pagination}
                  dispatch={(subMsg) =>
                    dispatch({ _tag: 'PaginationMsg', subMsg })
                  }
                />
              </div>
            </>
          ),
        ),
      )}
    </div>
  )
}

const profileErrorView = (route: AppRoute) => {
  const username = route.page._tag === 'ProfilePage' ? route.page.username : ''

  return (
    <div className='mx-auto my-[48px] flex max-w-[600px] flex-col items-center gap-[16px] rounded-lg bg-yellow-50 px-[24px] py-[48px] text-center'>
      <span className='text-6xl' role='img' aria-label='sad face'>
        😟
      </span>
      <div className='flex flex-col gap-[8px]'>
        <h1 className='text-3xl font-bold text-gray-900'>Profile not found</h1>
        <p className='text-gray-600'>
          Either the profile url is incorrect or
          <br />
          Something is wrong with
          <a
            href={`${API_BASE}/profiles/${username}`}
            target='_blank'
            rel='noopener noreferrer'
            className='mx-[4px] text-green-600 underline hover:text-green-700'
          >
            our server
          </a>
          right now,
          <br />
          please try again later
        </p>
      </div>

      <Link
        route={route}
        className='mt-[16px] inline-flex items-center gap-[8px] rounded bg-green-600 px-[24px] py-[10px] font-medium text-white transition-colors hover:bg-green-700'
      >
        <RotateCw size={18} />
        Refresh
      </Link>
    </div>
  )
}

export const ProfilePageMemo = memoStrategy(
  ProfilePageComponent,
  PropsEq.equals,
)
