import { Text } from 'ink'
import { memo } from 'react'

import { type ApiError, type HttpError } from '@/common/api'
import { formatListError } from '@/component/list-state/util'

export type ListStateProps = { entityLabel: string }

const ListLoadingComponent = ({ entityLabel }: ListStateProps) => (
  <Text dimColor>Loading {entityLabel}...</Text>
)

const ListEmptyComponent = ({ entityLabel }: ListStateProps) => (
  <Text dimColor>No {entityLabel} found.</Text>
)

export type ListErrorProps = {
  entityLabel: string
  error: HttpError<ApiError>
}

const ListErrorComponent = ({ entityLabel, error }: ListErrorProps) => (
  <Text color='red'>
    Could not load {entityLabel}: {formatListError(error)}
  </Text>
)

export const ListLoadingMemo = memo(ListLoadingComponent)
export const ListEmptyMemo = memo(ListEmptyComponent)
export const ListErrorMemo = memo(ListErrorComponent)
