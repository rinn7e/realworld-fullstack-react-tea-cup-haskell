import { Text } from 'ink'
import { memo } from 'react'

import { getPaginationPageItems } from '@/component/pagination-nav/util'

export type PaginationNavProps = {
  currentPage: number
  pageAmount: number
}

// The pages as the web shows them (`getPaginationPageItems`), the current
// one highlighted
const PaginationNavComponent = ({
  currentPage,
  pageAmount,
}: PaginationNavProps) =>
  pageAmount <= 1 ? null : (
    <Text>
      {getPaginationPageItems(currentPage, pageAmount).map((item, i) =>
        item._tag === 'Ellipsis' ? (
          <Text key={i} dimColor>
            {' … '}
          </Text>
        ) : item.page === currentPage ? (
          <Text key={i} inverse color='cyan'>
            {` ${item.page} `}
          </Text>
        ) : (
          <Text key={i} dimColor>{` ${item.page} `}</Text>
        ),
      )}
    </Text>
  )

export const PaginationNavMemo = memo(PaginationNavComponent)
