import type { Result } from 'tea-cup-fp'

import type {
  ApiError,
  Article,
  ArticleResponse,
  HttpError,
} from '@/common/api'

export type Model = Article

export type Msg =
  | { _tag: 'Favorite' }
  | { _tag: 'Unfavorite' }
  | {
      _tag: 'FavoriteResponse'
      result: Result<HttpError<ApiError>, ArticleResponse>
    }
  | {
      _tag: 'UnfavoriteResponse'
      result: Result<HttpError<ApiError>, ArticleResponse>
    }
