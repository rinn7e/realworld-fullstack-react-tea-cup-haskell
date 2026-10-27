import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import React, { memo } from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { type AdminUser, AdminUserEq } from '@/common/api'
import { DetailRowMemo } from '@/component/detail-row'
import { ProfileThumbnailMemo } from '@/component/profile-thumbnail'

import { type Msg } from '../type'

export type UserDetailOverlayProps = {
  selectedUser: O.Option<AdminUser>
  dispatch: Dispatcher<Msg>
}

const UserDetailOverlayPropsEq: EqClass.Eq<UserDetailOverlayProps> =
  EqClass.struct({
    selectedUser: O.getEq(AdminUserEq),
    dispatch: EqAlways,
  })

const UserDetailOverlayComponent = ({
  selectedUser,
  dispatch,
}: UserDetailOverlayProps) => {
  if (O.isNone(selectedUser)) {
    return null
  } else {
    const user = selectedUser.value

    return (
      <>
        <div
          className='fixed inset-0 z-40 cursor-pointer bg-slate-900/20 backdrop-blur-[2px] dark:bg-black/50'
          onClick={() => dispatch({ _tag: 'ClearSelected' })}
        />
        <div className='animate-in slide-in-from-right dark:bg-surface-dark fixed top-0 right-0 z-50 h-full w-full max-w-[50%] bg-white shadow-2xl duration-300'>
          <div className='flex h-full flex-col'>
            <div className='flex items-center justify-between border-b border-slate-100 p-[24px] dark:border-white/20'>
              <h3 className='text-theme-secondary text-[20px] font-bold dark:text-white'>
                User Profile
              </h3>
              <button
                type='button'
                onClick={() => dispatch({ _tag: 'ClearSelected' })}
                className='rounded-full p-[8px] text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-white'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-[20px] w-[20px]'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <div className='flex-grow overflow-y-auto p-[32px]'>
              <div className='flex items-center gap-[12px] pb-[32px]'>
                <ProfileThumbnailMemo
                  src={user.image}
                  className='h-[100px] w-[100px] rounded-[24px] border-4 border-white object-cover shadow-lg'
                />
                <div>
                  <div className='text-theme-secondary text-[24px] font-bold dark:text-white'>
                    {user.username}
                  </div>
                  <div className='text-slate-500 dark:text-slate-200'>
                    {user.email}
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-[24px]'>
                <DetailRowMemo
                  label='User ID'
                  value={user.id.toString()}
                  isMono={true}
                />
                <DetailRowMemo label='Role' value={user.role} isMono={false} />
                <DetailRowMemo
                  label='Account Status'
                  value='Active'
                  isMono={false}
                />
              </div>

              <div className='pt-[16px]'>
                <div className='pb-[8px] text-[12px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-200'>
                  Biography
                </div>
                <div className='rounded-[12px] border border-slate-100 bg-slate-50 p-[20px] text-[15px] leading-relaxed text-slate-600 italic dark:border-white/20 dark:bg-black/20 dark:text-slate-200'>
                  "{user.bio || 'This user has not written a bio yet.'}"
                </div>
              </div>

              {/* TODO: Member since and Total Articles are currently mock values since the AdminUser API does not return them */}
              <div className='pt-[32px]'>
                <div className='bg-theme-primary/10 rounded-[16px] p-[24px]'>
                  <div className='text-theme-primary font-bold'>
                    Account Meta
                  </div>
                  <div className='text-theme-primary/80 flex flex-col gap-[8px] pt-[12px] text-[14px]'>
                    <div className='flex justify-between'>
                      <span>Member since</span>
                      <span className='font-medium'>Jan 2024</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Total Articles</span>
                      <span className='font-medium'>12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export const UserDetailOverlayMemo = memo(
  UserDetailOverlayComponent,
  UserDetailOverlayPropsEq.equals,
)
