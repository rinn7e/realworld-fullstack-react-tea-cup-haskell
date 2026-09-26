import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import { memo } from 'react'

import {
  type ApiError,
  ApiErrorEq,
  type HttpError,
  getHttpErrorEq,
} from '@/common/api'

import { formatListError } from './util'

const ListLoadingComponent = () => (
  <div className='flex justify-center py-[60px]'>
    <div className='border-theme-primary h-10 w-10 animate-spin rounded-full border-t-2 border-b-2'></div>
  </div>
)

export const ListLoadingMemo = memo(ListLoadingComponent)

export type ListErrorProps = {
  // Plural entity name, e.g. 'users'
  entityLabel: string
  error: HttpError<ApiError>
}

const ListErrorPropsEq: EqClass.Eq<ListErrorProps> = EqClass.struct({
  entityLabel: S.Eq,
  error: getHttpErrorEq(ApiErrorEq),
})

const ListErrorComponent = ({ entityLabel, error }: ListErrorProps) => (
  <div className='rounded-[12px] bg-red-50 p-[24px] font-semibold text-red-600 shadow-sm dark:bg-red-950/20 dark:text-red-400'>
    Error loading {entityLabel}: {formatListError(error)}
  </div>
)

export const ListErrorMemo = memo(ListErrorComponent, ListErrorPropsEq.equals)

export type ListEmptyProps = {
  // Plural entity name, e.g. 'users'
  entityLabel: string
}

const ListEmptyPropsEq: EqClass.Eq<ListEmptyProps> = EqClass.struct({
  entityLabel: S.Eq,
})

const ListEmptyComponent = ({ entityLabel }: ListEmptyProps) => (
  <div className='py-[60px] text-center font-medium text-slate-500 dark:text-neutral-400'>
    No {entityLabel} found.
  </div>
)

export const ListEmptyMemo = memo(ListEmptyComponent, ListEmptyPropsEq.equals)
