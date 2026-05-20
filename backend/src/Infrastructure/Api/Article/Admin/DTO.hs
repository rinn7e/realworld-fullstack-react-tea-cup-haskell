module Infrastructure.Api.Article.Admin.DTO
  ( AdminArticle (..)
  , AdminArticleListResponse (..)
  )
where

import Data.Aeson (ToJSON)
import Data.OpenApi (ToSchema)
import Data.Text (Text)
import Data.Time (UTCTime)
import GHC.Generics (Generic)

import Infrastructure.Api.User.Admin.DTO (AdminUserResponse (..))

-------------------------------
-- Admin Article
-------------------------------

data AdminArticle = AdminArticle
  { id :: Int
  , slug :: Text
  , title :: Text
  , description :: Text
  , body :: Text
  , tagList :: [Text]
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  , favorited :: Bool
  , favoritesCount :: Int
  , author :: AdminUserResponse
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)

data AdminArticleListResponse = AdminArticleListResponse
  { articles :: [AdminArticle]
  , articlesCount :: Int
  }
  deriving stock (Show, Generic)
  deriving anyclass (ToJSON, ToSchema)
