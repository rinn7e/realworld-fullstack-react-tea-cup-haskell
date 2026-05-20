module Domain.Article where

import Data.Aeson (FromJSON, ToJSON)
import Data.Semigroup (First (..))
import Data.Text (Text)
import Data.Time (UTCTime)
import Domain.Tag (Tag)
import Domain.User (User, UserId)
import GHC.Generics (Generic)
import Web.HttpApiData (FromHttpApiData, ToHttpApiData)

newtype ArticleId = ArticleId {unArticleId :: Int}
  deriving stock (Eq, Ord, Show, Generic)
  deriving newtype (Num, ToJSON, FromJSON, ToHttpApiData, FromHttpApiData)

data Article = Article
  { articleId :: ArticleId
  , slug :: Text
  , title :: Text
  , description :: Text
  , body :: Text
  , authorId :: UserId
  , createdAt :: UTCTime
  , updatedAt :: UTCTime
  }
  deriving stock (Eq, Show, Generic)

data ArticleGrouped = ArticleGrouped
  { article :: First Article
  , author :: First User
  , tags :: [Tag]
  , favoritesCount :: First Int
  , isFavorited :: First Bool
  , isFollowingAuthor :: First Bool
  }
  deriving stock (Eq, Show, Generic)

instance Semigroup ArticleGrouped where
  a <> b =
    ArticleGrouped
      { article = a.article <> b.article
      , author = a.author <> b.author
      , tags = a.tags <> b.tags
      , favoritesCount = a.favoritesCount <> b.favoritesCount
      , isFavorited = a.isFavorited <> b.isFavorited
      , isFollowingAuthor = a.isFollowingAuthor <> b.isFollowingAuthor
      }
