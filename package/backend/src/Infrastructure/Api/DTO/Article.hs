module Infrastructure.Api.DTO.Article
  ( Article (..)
  , ArticleResponse (..)
  , ArticleListResponse (..)
  , NewArticleRequest (..)
  , ArticleWrapper (..)
  , UpdateArticleRequest (..)
  , toArticleResponse
  , toAdminArticle
  , AdminArticle (..)
  , AdminArticleListResponse (..)
  )
where

import Data.Aeson (FromJSON (..), ToJSON (..))
import Data.Aeson qualified as A
import Data.OpenApi
  ( ToSchema (..)
  )
import Data.Time (UTCTime)
import GHC.Generics (Generic)

import Domain.Type qualified as D
import Infrastructure.Api.DTO.User
  ( AdminUserResponse (..)
  , Profile (..)
  , toAdminUserResponse
  )

-------------------------------
-- Article
-------------------------------
data Article = Article
  { slug :: D.ArticleSlug
  , title :: D.ArticleTitle
  , description :: D.ArticleDescription
  , body :: D.ArticleBody
  , tagList :: [D.TagName]
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  , favorited :: Bool
  , favoritesCount :: Int
  , author :: Profile
  }
  deriving (Show, Generic, ToSchema)

instance ToJSON Article where
  toJSON = A.genericToJSON A.defaultOptions

-------------------------------
-- ArticleResponse
-------------------------------
data ArticleResponse = ArticleResponse {article :: Article}
  deriving (Show, Generic, ToJSON, ToSchema)

-------------------------------
-- ArticleListResponse
-- -------------------------------
data ArticleListResponse = ArticleListResponse
  { articles :: [Article]
  , articlesCount :: Int
  }
  deriving (Show, Generic, ToJSON, ToSchema)

data ArticleWrapper a = ArticleWrapper
  { article :: a
  }
  deriving (Show, Generic)

instance (FromJSON a) => FromJSON (ArticleWrapper a)
instance (ToSchema a) => ToSchema (ArticleWrapper a)

-------------------------------
-- NewArticleRequest
-- -------------------------------
data NewArticleRequest = NewArticleRequest
  { title :: D.ArticleTitle
  , description :: D.ArticleDescription
  , body :: D.ArticleBody
  , tagList :: Maybe [D.TagName]
  }
  deriving (Show, Generic, FromJSON, ToSchema)

-------------------------------
-- UpdateArticleRequest
-------------------------------
data UpdateArticleRequest = UpdateArticleRequest
  { title :: Maybe D.ArticleTitle
  , description :: Maybe D.ArticleDescription
  , body :: Maybe D.ArticleBody
  , tagList :: Maybe [D.TagName]
  }
  deriving (Show, Generic, FromJSON, ToSchema)

-------------------------------
-- Admin Article
-------------------------------
data AdminArticle = AdminArticle
  { id :: Int
  , slug :: D.ArticleSlug
  , title :: D.ArticleTitle
  , description :: D.ArticleDescription
  , body :: D.ArticleBody
  , tagList :: [D.TagName]
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

-------------------------------
-- Helpers
-------------------------------
toArticleResponse :: D.ArticleDetail -> Article
toArticleResponse am =
  let art = am.article
      author = am.author
      tags = map (\t -> t.name) am.tags
      isFol = am.isFollowingAuthor
      isFav = am.isFavorited
      favCount = am.favoritesCount
      profile = Profile author.username author.bio author.image isFol
   in Article
        art.slug
        art.title
        art.description
        art.body
        tags
        art.createdAt
        art.updatedAt
        isFav
        favCount
        profile

toAdminArticle :: D.ArticleDetail -> AdminArticle
toAdminArticle am =
  let art = am.article
      author = am.author
      tags = map (\t -> t.name) am.tags
      isFav = am.isFavorited
      favCount = am.favoritesCount
      adminAuthor = toAdminUserResponse author
   in AdminArticle
        art.articleId.unArticleId
        art.slug
        art.title
        art.description
        art.body
        tags
        art.createdAt
        art.updatedAt
        isFav
        favCount
        adminAuthor
