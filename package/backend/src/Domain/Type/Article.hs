module Domain.Type.Article where

import Data.Aeson (FromJSON, ToJSON)
import Data.String (IsString)
import Data.Text (Text)
import qualified Data.Text as T
import Data.Time (UTCTime)
import Domain.Type.Tag (Tag)
import Domain.Type.User (User, UserId)
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData(..), ToHttpApiData(..))

newtype ArticleId = ArticleId {unArticleId :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

newtype ArticleSlug = ArticleSlug {unArticleSlug :: Text}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

newtype ArticleTitle = ArticleTitle {unArticleTitle :: Text}
  deriving stock (Eq, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

newtype ArticleDescription = ArticleDescription {unArticleDescription :: Text}
  deriving stock (Eq, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

newtype ArticleBody = ArticleBody {unArticleBody :: Text}
  deriving stock (Eq, Show, Generic)
  deriving newtype (ToJSON, FromJSON, ToHttpApiData, FromHttpApiData, IsString)

data Article = Article
  { articleId :: ArticleId
  , slug :: ArticleSlug
  , title :: ArticleTitle
  , description :: ArticleDescription
  , body :: ArticleBody
  , authorId :: UserId
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  }
  deriving stock (Eq, Show, Generic)

data ArticleSort = ArticleSortId | ArticleSortTitle | ArticleSortFavoritesCount | ArticleSortCreatedAt
  deriving stock (Eq, Ord, Show, Generic)
  deriving anyclass (ToJSON, FromJSON)

instance FromHttpApiData ArticleSort where
  parseQueryParam t = case t of
    "id" -> Right ArticleSortId
    "title" -> Right ArticleSortTitle
    "favoritesCount" -> Right ArticleSortFavoritesCount
    "createdAt" -> Right ArticleSortCreatedAt
    _ -> Left "Invalid sort field"

instance ToHttpApiData ArticleSort where
  toQueryParam ArticleSortId = "id"
  toQueryParam ArticleSortTitle = "title"
  toQueryParam ArticleSortFavoritesCount = "favoritesCount"
  toQueryParam ArticleSortCreatedAt = "createdAt"

data ArticleDetail = ArticleDetail
  { article :: Article
  , author :: User
  , tags :: [Tag]
  , favoritesCount :: Int
  , isFavorited :: Bool
  , isFollowingAuthor :: Bool
  }
  deriving stock (Eq, Show, Generic)
