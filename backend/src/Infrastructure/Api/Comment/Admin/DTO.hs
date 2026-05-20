module Infrastructure.Api.Comment.Admin.DTO
  ( AdminCommentResponse (..)
  , AdminCommentListResponse (..)
  )
where

import Data.Aeson (ToJSON (..))
import Data.OpenApi (ToSchema (..))
import Data.Text (Text)
import Data.Time (UTCTime)
import GHC.Generics (Generic)

-------------------------------
-- Admin Comment
-------------------------------

data AdminCommentResponse = AdminCommentResponse
  { id :: Int
  , body :: Text
  , createdAt :: UTCTime
  , articleSlug :: Text
  , authorUsername :: Text
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

data AdminCommentListResponse = AdminCommentListResponse
  { comments :: [AdminCommentResponse]
  , totalCount :: Int
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)
